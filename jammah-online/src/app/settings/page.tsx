export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Developers</h2>
          <div className="p-6 border rounded-lg bg-gray-50">
            <p className="mb-2">
              <strong>Project Start Date:</strong> September 2025
            </p>
            <p className="mb-4">
              <strong>How it was made:</strong> This project was built with Next.js, Prisma, NextAuth.js, and Tailwind CSS, brought to life by the power of AI.
            </p>
            <p className="text-sm text-gray-500 opacity-75">
              Developed By Hussain Alkhatib
            </p>
          </div>
        </div>
        {/* Other settings can be added here */}
      </div>
    </div>
  );
}
