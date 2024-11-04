import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <div className="py-12 px-4 md:px-8 lg:px-16 xl:px-32 bg-gray-100 text-sm mt-16">
            {/* TOP */}
            <div className="flex flex-col md:flex-row justify-between gap-12">
                {/* LEFT */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <Link href="/">
                        <div className="text-xl font-semibold">CHAT-&-CART</div>
                        <p className="mt-2">VIT Chennai, Vandalur-Kelambakkam, 600127</p>
                        <div className="mt-2">
                            <span className="block font-semibold">ChatCart@gmail.com</span>
                            <span className="block font-semibold mt-2">+91 1234567890</span>
                        </div>
                        <div className="mt-4 flex gap-4">
                            <Image src="/instagram.png" alt="Instagram" width={30} height={30} />
                            <Image src="/x.png" alt="X" width={30} height={30} />
                            <Image src="/youtube.png" alt="YouTube" width={30} height={30} />
                            <Image src="/linkedin.png" alt="LinkedIn" width={30} height={30} />
                        </div>
                    </Link>
                </div>

                {/* CENTER */}
                <div className="hidden lg:flex justify-between w-full md:w-1/3">
                    <div className="flex flex-col">
                        <h1 className="font-semibold">COMPANY</h1>
                        <div className="flex flex-col gap-4">
                            <Link href="">About Us</Link>
                            <Link href="">Careers</Link>
                            <Link href="">Affiliates</Link>
                            <Link href="">Blog</Link>
                            <Link href="">Contact Us</Link>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-semibold">SHOP</h1>
                        <div className="flex flex-col gap-4">
                            <Link href="">New Arrivals</Link>
                            <Link href="">Men</Link>
                            <Link href="">Women</Link>
                            <Link href="">All Products</Link>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-semibold">HELP</h1>
                        <div className="flex flex-col gap-4">
                            <Link href="">Customer Service</Link>
                            <Link href="">My Account</Link>
                            <Link href="">Find a store</Link>
                            <Link href="">Legal & Privacy</Link>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <h1 className="font-medium">SUBSCRIBE</h1>
                    <p>Get the latest news about trends and promotions!</p>
                    <div className="flex mt-2">
                        <input type="text" placeholder="Email Address" className="p-2 w-3/4" />
                        <button className="w-1/4 bg-lama text-white p-2">JOIN</button>
                    </div>
                    <span className="font-semibold mt-4">Secure Payments</span>
                    <div className="flex gap-2 mt-2">
                        <Image src="/upi.png" alt="UPI" width={30} height={20} />
                        <Image src="/gpay.png" alt="GPay" width={30} height={20} />
                        <Image src="/phonepe.png" alt="PhonePe" width={30} height={20} />
                        <Image src="/Mastercard.png" alt="Mastercard" width={40} height={20} />
                        <Image src="/Visa.png" alt="Visa" width={40} height={20} />
                    </div>
                </div>
            </div>

            {/* BOTTOM */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-8">
                <div>© 2024 Chat-&-Cart</div>
                <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
                    <div>
                        <span className="text-gray-500 mr-2">Language</span>
                        <span className="font-medium">India | English</span>
                    </div>
                    <div>
                        <span className="text-gray-500 mr-2">Currency</span>
                        <span className="font-medium">&#8377; Indian Rupee</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
