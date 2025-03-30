/**
 * MoreInfoPage Component
 *
 * This component provides a detailed guide on how to use the link shortener app.
 * It explains the steps to shorten a link, customize it, and share it.
 * The page is styled with Tailwind CSS for a clean and user-friendly design.
 *
 * @component
 * @returns {JSX.Element} The rendered informational page.
 */
export default function MoreInfoPage() {
    return (
        <div className="h-220 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-800 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
                    📚 How to Use Our Link Shortener App
                </h1>
                <p className="text-lg text-gray-700 mb-6 text-center">
                    Welcome! Here's how to use our app to shorten links quickly and easily. 🌟
                </p>
                <ol className="list-decimal list-inside space-y-4 text-gray-700">
                    <li>
                        🔗 <strong>Paste Your Link:</strong> Copy the long link you want to shorten and paste it into the main input field.
                    </li>
                    <li>
                        ✂️ <strong>Click "Shorten":</strong> Hit the shorten button and our app will generate a shorter link for you.
                    </li>
                    <li>
                        📋 <strong>Copy Your Short Link:</strong> Once generated, copy the short link and share it with the world.
                    </li>
                </ol>
                <p className="text-lg text-gray-700 mt-6">
                    🎉 But wait, there's more! You can even customize your short link with your own name or a fun alias. Want to make it personal? Go ahead and add your flair! 🚀
                </p>
                <p className="text-lg text-gray-700 mt-4">
                    Oh, and if you're feeling lazy (we get it), you can let the app generate a random short URL for you. No thinking required! 🧠✨
                </p>
                <p className="text-lg text-gray-700 mt-4">
                    So, what are you waiting for? Start shortening links like a pro and share them with style. If you have any questions, don't hesitate to reach out. Happy linking! 😎
                </p>
            </div>
        </div>
    );
}