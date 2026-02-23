# FinSight AI - Financial Document Analysis Platform

![Build Status](https://github.com/udhofarhanahmed/finsight-ai/actions/workflows/node.js.yml/badge.svg)


**FinSight AI** is an intelligent financial document analysis platform that leverages artificial intelligence to extract, analyze, and visualize key financial metrics from PDF documents. Built for financial professionals, accountants, and business analysts who need to quickly extract insights from financial statements, reports, and documents.

## 🎯 Key Features

- **AI-Powered PDF Analysis**: Automatically extract text and data from financial PDFs using advanced LLM technology
- **Financial Metrics Extraction**: Identify and extract key financial indicators including revenue, net income, profit margins, ROE, ROA, and custom KPIs
- **Executive Summaries**: Generate concise, AI-powered summaries highlighting key findings and financial performance
- **Trend Analysis**: Identify patterns and trends in financial data across time periods
- **Secure Document Storage**: User-specific access control with encrypted cloud storage integration
- **Document History**: Track all uploaded documents and their analysis results
- **Real-time Notifications**: Owner notifications for document uploads and analysis events
- **Responsive Dashboard**: Clean, professional interface optimized for desktop and mobile

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express.js + tRPC + Node.js
- **Database**: MySQL with Drizzle ORM
- **AI/LLM**: Manus Forge API (GPT-4, GPT-4 Vision)
- **Storage**: S3-compatible cloud storage
- **Authentication**: Manus OAuth

### Project Structure

```
finsight-ai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── pages/         # Page components (Dashboard, DocumentDetail)
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # tRPC client configuration
│   │   └── App.tsx        # Main app router
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routers/
│   │   └── documents.ts   # Document management procedures
│   ├── ai.ts              # AI/LLM integration
│   ├── db.ts              # Database queries
│   ├── storage.ts         # S3 storage helpers
│   └── _core/             # Core infrastructure
├── drizzle/               # Database schema and migrations
└── shared/                # Shared types and constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm package manager
- MySQL database
- Manus account with Forge API access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/udhofarhanahmed/finsight-ai.git
   cd finsight-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file with the following variables:
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/finsight_ai
   VITE_APP_ID=your_app_id
   JWT_SECRET=your_jwt_secret
   OAUTH_SERVER_URL=https://api.manus.im
   BUILT_IN_FORGE_API_URL=https://forge.manus.im
   BUILT_IN_FORGE_API_KEY=your_forge_api_key
   OWNER_OPEN_ID=your_owner_id
   ```

4. **Initialize the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## 📖 Usage

### Upload a Financial Document

1. Navigate to the Dashboard
2. Click "Select File" or drag-and-drop a PDF document
3. The system will validate the file (PDF format, max 10MB)
4. Document is uploaded to secure cloud storage

### Analyze a Document

1. After upload, click the "Analyze" button on the document
2. The AI system will:
   - Extract all text from the PDF
   - Generate an executive summary
   - Extract financial metrics and KPIs
   - Analyze trends and patterns
3. Results are displayed in the Document Detail view

### View Analysis Results

1. Click "View Results" on any completed document
2. Three tabs provide different views:
   - **Executive Summary**: AI-generated analysis and insights
   - **Financial Metrics**: Extracted KPIs with confidence scores
   - **Extracted Text**: Raw text extracted from the PDF

## 🔐 Security & Access Control

- **User Authentication**: OAuth-based authentication ensures only authorized users can access the system
- **Document Access Control**: Users can only access their own documents
- **Secure Storage**: Documents are stored in encrypted cloud storage with user-specific access keys
- **Data Privacy**: All sensitive financial data is encrypted at rest and in transit
- **Audit Trail**: All document uploads and analyses are logged for compliance

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Tests are located in `server/*.test.ts` files and cover:
- Document upload validation
- Financial metrics extraction
- User access control
- Error handling

## 📊 API Endpoints

All API endpoints are exposed through tRPC at `/api/trpc`:

### Documents Router

- `documents.upload` - Upload a new PDF document
- `documents.list` - Get all documents for current user
- `documents.getDetail` - Get document with analysis results
- `documents.analyze` - Trigger analysis on a document
- `documents.delete` - Delete a document

## 🔄 Data Flow

```
1. User uploads PDF
   ↓
2. File validated and stored in S3
   ↓
3. Analysis triggered via tRPC
   ↓
4. AI extracts text from PDF
   ↓
5. Financial metrics extracted
   ↓
6. Executive summary generated
   ↓
7. Results stored in database
   ↓
8. Frontend displays results
```

## 🎨 Design Principles

- **Professional & Clean**: Designed for financial professionals with a focus on clarity
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation support
- **Performance**: Optimized for fast load times and smooth interactions
- **User-Centric**: Intuitive workflows that minimize user friction

## 🛠️ Development

### Add a New Feature

1. Update database schema in `drizzle/schema.ts`
2. Run `pnpm db:push` to migrate
3. Add database queries in `server/db.ts`
4. Create tRPC procedures in `server/routers/documents.ts`
5. Build frontend components in `client/src/pages/`
6. Write tests in `server/*.test.ts`

### Code Style

- TypeScript for type safety
- ESLint and Prettier for code formatting
- Tailwind CSS for styling
- shadcn/ui components for UI consistency

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `VITE_APP_ID` | Manus OAuth application ID |
| `JWT_SECRET` | Secret for session signing |
| `OAUTH_SERVER_URL` | Manus OAuth server URL |
| `BUILT_IN_FORGE_API_URL` | Forge API base URL |
| `BUILT_IN_FORGE_API_KEY` | Forge API authentication key |
| `OWNER_OPEN_ID` | Owner's Manus OpenID for notifications |

## 🚀 Deployment

The application is ready for deployment on any Node.js hosting platform:

1. Build the project: `pnpm build`
2. Start the server: `pnpm start`
3. Ensure environment variables are set in your hosting platform
4. Database migrations run automatically on startup

## 📞 Support & Feedback

For issues, feature requests, or feedback, please open an issue on GitHub.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 About the Author

**Farhan Ahmed** - BBA Graduate with expertise in accounting and financial analysis, exploring the intersection of finance and artificial intelligence.

---

**FinSight AI** - Making financial analysis smarter, faster, and more accessible.
