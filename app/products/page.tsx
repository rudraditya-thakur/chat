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

const MIN_SIMILARITY_THRESHOLD = 0.3; // Define the threshold for relevance

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

        // Collect all terms and calculate document frequency
        documents.forEach(doc => {
            const docTerms = new Set(doc.toLowerCase().split(/\W+/).filter(term => term.length > 0));
            docTerms.forEach(term => {
                terms.add(term);
                documentFreq.set(term, (documentFreq.get(term) || 0) + 1);
            });
        });

        // Calculate TF-IDF for each document
        documents.forEach(doc => {
            const vector = new Map<string, number>();
            const wordCount = new Map<string, number>();

            // Calculate term frequency
            doc.toLowerCase().split(/\W+/).filter(term => term.length > 0).forEach(term => {
                wordCount.set(term, (wordCount.get(term) || 0) + 1);
            });

            // Calculate TF-IDF for each term
            terms.forEach(term => {
                const tf = (wordCount.get(term) || 0) / (doc.split(/\W+/).length);
                const idf = Math.log(documents.length / (documentFreq.get(term) || 1));
                vector.set(term, tf * idf);
            });

            tfIdfVectors.push(vector);
        });

        return { tfIdfVectors, terms };
    };

    // Calculate cosine similarity between two vectors
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

    // Google PageRank Simplified Algorithm (Randomized for relevance adjustment)
    const applyPageRank = (scores: number[], maxResults: number) => {
        const adjustedScores = scores.map(score => score + Math.random() * 0.1);  // Small random adjustment for variety
        const sortedIndices = adjustedScores
            .map((score, index) => ({ index, score }))
            .sort((a, b) => b.score - a.score)
            .map(item => item.index);

        // Limit the results
        return sortedIndices.slice(0, maxResults);
    };

    // Improved POS Tagging: Extract relevant keywords
    const extractKeywords = useMemo(() => (query: string) => {
        const doc = nlp(query);
        const terms = new Set<string>();

        // Extract only nouns and adjectives that are relevant for search matching
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

        // Consider verbs for actions or important keywords
        doc.verbs().out('array').forEach(term => {
            if (term.length > 2) {
                terms.add(term.toLowerCase());
            }
        });

        return Array.from(terms);
    }, []);

    useEffect(() => {
        const query = searchParams.get("query");

        if (!query || !productsDB?.length) {
            setFilteredProducts(productsDB || []);
            return;
        }

        try {
            // Prepare documents for TF-IDF
            const documents = [
                query,
                ...productsDB.map(p => p.productName)
            ];

            // Create TF-IDF index
            const { tfIdfVectors, terms } = createTfIdfIndex(documents);

            // Calculate similarity scores
            const queryVector = tfIdfVectors[0];
            const similarities = productsDB.map((product, index) => ({
                product,
                score: cosineSimilarity(queryVector, tfIdfVectors[index + 1], terms)
            }));

            // Extract keywords for additional matching
            const keywords = extractKeywords(query);

            // Filter out products that are below the threshold and sort by similarity and rating
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
                .map(({ product }) => product);  // Extract sorted products

            // Apply PageRank to adjust the ranking
            const resultIndices = applyPageRank(filteredAndSortedProducts.map(p => p.score), 70);

            const finalFilteredProducts = resultIndices.map(index => filteredAndSortedProducts[index]);

            setFilteredProducts(finalFilteredProducts);

        } catch (error) {
            console.error('Error processing search:', error);
            setFilteredProducts(productsDB || []);
        }
    }, [searchParams, productsDB, extractKeywords]);

    // Handle price sorting
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

    // Loading state
    if (!productsDB) {
        return (
            <div className="p-4 text-center">
                <p className="text-gray-600">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Results Count */}
            {searchParams.get("query") && (
                <p className="text-gray-600 mb-4">
                    Found {filteredProducts.length} results for "{searchParams.get("query")}"
                </p>
            )}

            {/* Sorting Options */}
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

            {/* Product Grid */}
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
                    <p className="text-gray-600">No products found.</p>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
