# UNWRA Dashboard

A comprehensive dashboard for teachers to monitor student assessments and progress, with support for English and Arabic languages.

## Features

- **Multi-language Support**: English and Arabic with automatic RTL layout support
- **Language Picker**: Easy switching between languages with a dropdown menu
- **Responsive Design**: Works on desktop and mobile devices
- **Assessment Tracking**: Monitor student progress across different SEL skill categories
- **AI Chat Assistant**: Get insights and recommendations about your students
- **Data Export**: Download assessment data in CSV format

## Language Support

The dashboard supports two languages:

- **English (en)**: Default language with LTR layout
- **Arabic (ar)**: Full RTL support with Arabic translations

### Switching Languages

Use the language picker in the top-right corner of any page to switch between languages. The interface will automatically adjust:

- Text direction (LTR/RTL)
- Font family for better readability
- Layout adjustments for RTL languages

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
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── chat/             # AI chat interface
│   ├── data/             # Data visualization and export
│   └── page.tsx          # Main dashboard
├── components/            # Reusable React components
│   ├── LanguagePicker.tsx # Language selection component
│   ├── StatusBadge.tsx   # Status indicator component
│   └── CategoryCircle.tsx # Category visualization
├── lib/                   # Utility libraries
│   ├── i18n.ts          # Internationalization configuration
│   ├── appwrite.ts      # Appwrite client configuration
│   └── locales/         # Translation files
│       ├── en.json      # English translations
│       └── ar.json      # Arabic translations
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Adding New Languages

To add support for additional languages:

1. Create a new translation file in `src/lib/locales/` (e.g., `fr.json`)
2. Add the language to the `resources` object in `src/lib/i18n.ts`
3. Update the `LanguagePicker` component to include the new language
4. Add appropriate RTL support if needed

## Technologies Used

- **Next.js 14**: React framework with app router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **react-i18next**: Internationalization for React
- **i18next**: Internationalization framework
- **Lucide React**: Icon library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
