#!/bin/bash

# Development setup script

echo "🚀 Setting up Project Management AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

echo "🔧 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please update the .env file with your configuration"
else
    echo "ℹ️  .env file already exists"
fi

echo "🗄️  Setting up database..."
cd server
if [ -n "$DATABASE_URL" ]; then
    echo "🔄 Generating Prisma client..."
    npx prisma generate
    
    echo "🔄 Pushing database schema..."
    npx prisma db push
    
    echo "✅ Database setup complete"
else
    echo "⚠️  DATABASE_URL not set. Please configure your database in .env"
fi
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with the correct values"
echo "2. Set up your PostgreSQL database"
echo "3. Get an OpenAI API key from https://platform.openai.com"
echo "4. Run 'npm run dev' to start the development servers"
echo ""
echo "Happy coding! 🚀"