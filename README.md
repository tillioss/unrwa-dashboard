# UNWRA Teacher Dashboard

A modern, mobile-first teacher admin dashboard built with Next.js and Tailwind CSS for monitoring student assessments and progress.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Grade & Class Selection**: Dropdown menus to select specific grades and classes
- **Assessment Management**: View data from 4 different assessments
- **Quick Summary**: AI-generated summaries of assessment data (toggle on/off)
- **Assessment Tracker**: Table showing assessment deployment status and progress
- **Class Insights**: Detailed breakdown of student performance by categories
- **Mobile Navigation**: Bottom navigation with Home, AI Chat, and Data View icons

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd unwra-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
unwra-dashboard/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind imports
│   │   ├── layout.tsx           # Root layout component
│   │   └── page.tsx             # Main dashboard page
│   └── components/              # Reusable components (future)
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## Key Components

### Dashboard Sections

1. **Header**: Logo, title, and AI search input
2. **Navigation**: Grade/class dropdowns and assessment selection
3. **Quick Summary**: Toggleable AI-generated summary (max 60 words)
4. **Assessment Tracker**: Table showing assessment status (Completed, Ongoing, Pending)
5. **Class Assessment Insights**: Collapsible sections with detailed performance data
6. **Mobile Navigation**: Bottom navigation bar with 3 icons

### Data Structure

- **Grades**: Grade 1-5 selection
- **Assessments**: 4 different assessment types
- **Status Types**: Completed, Ongoing, Pending
- **Categories**: Beginner, Growth, Expert
- **Performance Areas**: Self Awareness, Self Management

## Customization

### Colors

The dashboard uses a custom color palette defined in `tailwind.config.js`:

- Primary: Blue shades
- Secondary: Pink shades
- Success: Green shades
- Warning: Yellow/Orange shades
- Danger: Red shades

### Adding New Features

1. Create new components in `src/components/`
2. Update the main dashboard in `src/app/page.tsx`
3. Add new routes in `src/app/` for additional pages

## Build and Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
