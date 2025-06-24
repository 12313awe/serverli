# BioCryptor - Genetic Encryption AI Platform

A modern, full-stack application featuring genetic encryption algorithms powered by AI, built with React frontend and Express.js backend in a monorepo structure.

## 🏗️ Architecture

This project uses a monorepo structure with separate frontend and backend packages:

```
biocryptor-monorepo/
├── packages/
│   ├── frontend/          # React + TypeScript + Vite
│   └── backend/           # Express.js + TypeScript
├── package.json           # Root package.json with workspaces
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 7+ (for workspaces support)

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd biocryptor-monorepo
   npm install
   ```

2. **Environment Setup**
   
   **Backend (.env):**
   ```bash
   cd packages/backend
   cp .env.example .env
   # Edit .env with your configuration
   ```
   
   **Frontend (.env):**
   ```bash
   cd packages/frontend  
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Servers**
   ```bash
   # From root directory - starts both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run dev:backend   # Backend only (port 3001)
   npm run dev:frontend  # Frontend only (port 5173)
   ```

## 📦 Available Scripts

### Root Level Commands
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both packages
npm run start            # Start production backend
npm run lint             # Lint both packages
npm run clean            # Clean all build artifacts
```

### Backend Commands
```bash
npm run dev:backend      # Start backend development server
npm run build:backend    # Build backend for production
```

### Frontend Commands  
```bash
npm run dev:frontend     # Start frontend development server
npm run build:frontend   # Build frontend for production
```

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Winston** - Logging
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI components
- **React Query** - Data fetching
- **React Router** - Routing
- **Framer Motion** - Animations

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=3001
NODE_ENV=development
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:5173
LANGFLOW_BASE_URL=your_langflow_base_url
FLOW_ID=your_flow_id
LANGFLOW_API_KEY=your_api_key
HF_TOKEN=your_huggingface_token
```

### Frontend Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=30000
VITE_DEV_MODE=true
```

## 📡 API Endpoints

### Chat Endpoints
- `POST /api/v1/chat/message` - Send a message
- `GET /api/v1/chat/session/:sessionId/history` - Get session history
- `POST /api/v1/chat/session` - Create new session

### Health Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/ready` - Readiness check

## 🏃‍♂️ Development Workflow

1. **Start development servers:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/v1
   - Health Check: http://localhost:3001/api/v1/health

3. **Make changes:**
   - Frontend changes auto-reload via Vite HMR
   - Backend changes auto-restart via tsx watch

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database
- Set up proper logging
- Configure reverse proxy (nginx/Apache)
- Set up SSL certificates

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Configured for specific origins
- **Rate Limiting** - Prevents abuse
- **Input Validation** - Express validator
- **Error Handling** - Secure error responses
- **Logging** - Comprehensive request/error logging

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": 400,
    "details": { ... }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing

```bash
# Backend tests
cd packages/backend
npm test

# Frontend tests  
cd packages/frontend
npm test
```

## 📊 Monitoring & Logging

- **Winston** logging with file and console transports
- **Morgan** HTTP request logging
- Health check endpoints for monitoring
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.