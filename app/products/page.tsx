"use client";

import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import nlp from "compromise";
import { api } from "@/convex/_generated/api";

interface Product {
    _id: string;
    productName: string;
    price: number;
    rating: number;
    ratingCount: number;
    searchImage: string;
    landingPageUrl: string;
}

const MIN_SIMILARITY_THRESHOLD = 0.3;
const STOP_PHRASES = [
    "give me", "show me", "i want", "can you find", "please find", "find me", "i need",
    "search for", "i am looking for", "get me", "i would like", "could you find", "help me find",
    "where can i find", "let me see", "i am interested in", "would you show", "do you have",
    "looking for", "can i get", "is there", "is it possible to find", "could you show", "find",
    "search", "i’m trying to find", "may i have", "can you locate", "where do i find",
    "any chance of finding", "could i see", "please help me find", "i am searching for",
    "i wish to find", "show", "locate", "do you have any", "do you offer",
    "can you suggest", "is there any way to find", "how do i locate", "i am hoping to find",
    "would like to see", "can you help me with", "i would love to see", "bring me",
    "can i view", "suggest me", "point me to", "i’d be interested in", "anything available for",
    "direct me to", "would be nice to have", "is it possible to locate", "i am hunting for",
    "anything on", "do you happen to have", "got any", "i’m after", "wish to see",
    "find out if", "is there a way to locate", "show me if you have", "does it include",
    "is there a listing for", "please tell me", "any leads on", "i could use",
    "anything related to", "i want to see", "can you spot", "what can you show",
    "can you assist with finding", "bring up", "any information on", "let’s find",
    "i would enjoy seeing", "do you know where", "is it possible you have", "look for",
    "assist me with finding", "please list", "i was wondering if", "if there’s any",
    "find any", "pull up", "open up", "i’m looking to find", "help with finding",
    "discover", "i could find", "what do you have on", "where can i see",
    "can you display", "i’m curious about", "is there anything on", "please locate",
    "showcase", "if you can find", "i’ll need", "do you mind showing",
    "i would need", "give info on", "i’ll look for", "is there a resource for",
    "is it listed", "show details", "fetch", "i’ll be interested in",
    "i was thinking of finding", "anything specific for", "give an overview of",
    "is it available", "may i see", "provide options", "gather info on",
    "provide results for", "give recommendations for", "i was wondering if you have",
    "show products", "show options for", "highlight", "i’ll search",
    "retrieve", "show availability for", "suggest items for", "recommend",
    "do a search for", "research", "i’m interested to see", "offer me",
    "fetch details for", "i was thinking of checking", "see if you can locate",
    "fetch me", "let me check if there’s", "look up", "explore options for",
    "bring results for", "suggest for me", "show possibilities for", "advise on",
    "browse for", "guide me to", "pull options for", "find listings for",
    "can you retrieve", "access info on", "i wonder if there’s", "assist with",
    "can you gather", "display possibilities for", "can i browse", "would you bring",
    "where can one find", "display results for", "where might i find", "open",
    "list items for", "do you have listings for", "supply info on", "recommendations",
    "do you know about", "list options", "search me", "show me suggestions for",
    "help in finding", "provide details", "i’ll take a look at", "produce results for",
    "do you happen to know", "can you look into", "i was hoping to see", "might there be",
    "any info on", "examine", "assist in locating", "provide help with",
    "explore items for", "check out", "i am interested to check", "curious to know about",
    "curious if there’s", "list all options", "investigate if there’s", "would like a list of",
    "locate items for", "uncover", "find examples of", "can you find options for",
    "is there a directory of", "search and show", "list products", "any listing on",
    "review options for", "display choices for", "where do i search for",
    "are there choices for", "what’s listed for", "any recommendations on", "do you know if",
    "point towards", "give some options", "could you check for", "where would i find",
    "display related", "open listings for", "explore details", "can you find listings for",
    "is there an index of", "give me choices on", "would love to see if",
    "list recommendations", "can i see options for", "reveal", "explore for",
    "look into finding", "provide suggestions", "display relevant", "identify options for",
    "track down", "any information you have on", "trace", "i’d like details on",
    "give insight on", "do you have an inventory of", "what do you know about",
    "are there recommendations on", "navigate to options for", "do you hold information on",
    "expand on", "compile details for", "evaluate options", "is there insight on"
];



const ProductsPage = () => {
    const productsDB = useQuery(api.products.get);
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [sortOption, setSortOption] = useState<string>('default'); // State for sorting option

    // Create a TF-IDF index for the terms
    const createTfIdfIndex = (documents: string[]) => {
        const terms = new Set<string>();
        const documentFreq = new Map<string, number>();
        const tfIdfVectors: Map<string, number>[] = [];

        documents.forEach(doc => {
            const docTerms = new Set(doc.toLowerCase().split(/\W+/).filter(term => term.length > 0));
            docTerms.forEach(term => {
                terms.add(term);
                documentFreq.set(term, (documentFreq.get(term) || 0) + 1);
            });
        });

        documents.forEach(doc => {
            const vector = new Map<string, number>();
            const wordCount = new Map<string, number>();

            doc.toLowerCase().split(/\W+/).filter(term => term.length > 0).forEach(term => {
                wordCount.set(term, (wordCount.get(term) || 0) + 1);
            });

            terms.forEach(term => {
                const tf = (wordCount.get(term) || 0) / (doc.split(/\W+/).length);
                const idf = Math.log(documents.length / (documentFreq.get(term) || 1));
                vector.set(term, tf * idf);
            });

            tfIdfVectors.push(vector);
        });

        return { tfIdfVectors, terms };
    };

    const cosineSimilarity = (vec1: Map<string, number>, vec2: Map<string, number>, terms: Set<string>) => {
        let dotProduct = 0;
        let magnitude1 = 0;
        let magnitude2 = 0;

        terms.forEach(term => {
            const v1 = vec1.get(term) || 0;
            const v2 = vec2.get(term) || 0;
            dotProduct += v1 * v2;
            magnitude1 += v1 * v1;
            magnitude2 += v2 * v2;
        });

        magnitude1 = Math.sqrt(magnitude1);
        magnitude2 = Math.sqrt(magnitude2);

        return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
    };

    const applyPageRank = (scores: number[], maxResults: number) => {
        const adjustedScores = scores.map(score => score + Math.random() * 0.1);
        const sortedIndices = adjustedScores
            .map((score, index) => ({ index, score }))
            .sort((a, b) => b.score - a.score)
            .map(item => item.index);

        return sortedIndices.slice(0, maxResults);
    };

    const extractKeywords = useMemo(() => (query: string) => {
        const doc = nlp(query);
        const terms = new Set<string>();

        doc.nouns().out('array').forEach(term => {
            if (term.length > 2) {
                terms.add(term.toLowerCase());
            }
        });
        doc.adjectives().out('array').forEach(term => {
            if (term.length > 2) {
                terms.add(term.toLowerCase());
            }
        });
        doc.verbs().out('array').forEach(term => {
            if (term.length > 2) {
                terms.add(term.toLowerCase());
            }
        });

        return Array.from(terms);
    }, []);

    // Remove stop phrases from the search query
    const cleanQuery = (query: string) => {
        let cleanedQuery = query.toLowerCase();
        STOP_PHRASES.forEach(phrase => {
            cleanedQuery = cleanedQuery.replace(new RegExp(`\\b${phrase}\\b`, "gi"), "").trim();
        });
        return cleanedQuery;
    };

    useEffect(() => {
        const rawQuery = searchParams.get("query");
        const query = rawQuery ? cleanQuery(rawQuery) : "";

        if (!query || !productsDB?.length) {
            setFilteredProducts(productsDB || []);
            return;
        }

        try {
            const documents = [query, ...productsDB.map(p => p.productName)];
            const { tfIdfVectors, terms } = createTfIdfIndex(documents);
            const queryVector = tfIdfVectors[0];
            const similarities = productsDB.map((product, index) => ({
                product,
                score: cosineSimilarity(queryVector, tfIdfVectors[index + 1], terms)
            }));

            const keywords = extractKeywords(query);

            const filteredAndSortedProducts = similarities
                .filter(({ score }) => score >= MIN_SIMILARITY_THRESHOLD)
                .map(({ product, score }) => ({
                    product,
                    score: score + keywords.reduce((acc, keyword) =>
                        product.productName.toLowerCase().includes(keyword.toLowerCase()) ? acc + 0.2 : acc,
                        0
                    )
                }))
                .sort((a, b) => {
                    if (b.score === a.score) {
                        return b.product.rating - a.product.rating;
                    }
                    return b.score - a.score;
                })
                .map(({ product }) => product);

            const resultIndices = applyPageRank(filteredAndSortedProducts.map(p => p.score), 70);
            const finalFilteredProducts = resultIndices.map(index => filteredAndSortedProducts[index]);

            setFilteredProducts(finalFilteredProducts);

        } catch (error) {
            console.error('Error processing search:', error);
            setFilteredProducts(productsDB || []);
        }
    }, [searchParams, productsDB, extractKeywords]);

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const option = event.target.value;
        setSortOption(option);

        let sortedProducts = [...filteredProducts];

        if (option === 'low-to-high') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (option === 'high-to-low') {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(sortedProducts);
    };

    if (!productsDB) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-600">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {searchParams.get("query") && (
                <p className="text-gray-600 mb-4">
                    Found {filteredProducts.length} results for "{searchParams.get("query")}"
                </p>
            )}

            <div className="mb-4">
                <label htmlFor="sort" className="text-gray-600">Sort by Price:</label>
                <select
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="ml-2 p-2 border rounded-md"
                >
                    <option value="default">Default</option>
                    <option value="low-to-high">Price: Low to High</option>
                    <option value="high-to-low">Price: High to Low</option>
                </select>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="relative w-full h-48">
                                <img
                                    src={product.searchImage}
                                    alt={product.productName}
                                    className="rounded-md object-cover w-full h-full"
                                />
                            </div>
                            <h3 className="text-lg font-semibold mt-2">{product.productName}</h3>
                            <p className="text-gray-500">${product.price.toFixed(2)}</p>
                            <p className="text-gray-500">{product.rating} ⭐ ({product.ratingCount} ratings)</p>
                            <a
                                href={`https://myntra.com/${product.landingPageUrl}`}
                                className="text-blue-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Product
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600">No results found.</p>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
