# Tilli Dashboard API Documentation

API for accessing Tilli Dashboard data and translations. This API allows third-party integrations to retrieve assessment scores, teacher surveys, and localized content.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-production-domain.com` (update when deployed)

## Interactive Documentation

Visit `/api-docs` for interactive Swagger UI documentation where you can test all endpoints directly.

## Authentication

Currently, no authentication is required for API access. All endpoints are publicly accessible with CORS enabled for cross-origin requests.

## Endpoints

### 1. Get Assessment Scores

Retrieve assessment scores from the Appwrite database.

**Endpoint**: `GET /api/scores`

**Query Parameters** (all optional):
- `school` (string): School identifier (e.g., `"azmi_mufti_boys_p1"`)
- `grade` (string): Grade level (e.g., `"grade1"`)
- `assessment` (string): Assessment type - `child`, `teacher_report`, or `parent`
- `section` (string): Section identifier (e.g., `"a"`)
- `zone` (string): Zone identifier - `irbid`, `north_amman`, `south_amman`, or `zarqa`

**Behavior**:
- If all filter parameters are provided, returns filtered results
- Otherwise, returns all scores

**Example Request**:
```bash
GET /api/scores?school=azmi_mufti_boys_p1&grade=grade1&assessment=child&section=a&zone=irbid
```

**Example Response**:
```json
{
  "scores": [
    {
      "$id": "123456",
      "school": "azmi_mufti_boys_p1",
      "grade": "grade1",
      "assessment": "child",
      "total_students": 25,
      "testType": "PRE",
      "overall_level_distribution": {
        "beginner": 8,
        "growth": 12,
        "expert": 5
      },
      "category_level_distributions": {
        "self_awareness": {
          "beginner": 5,
          "growth": 15,
          "expert": 5
        },
        "social_management": { ... },
        "social_awareness": { ... },
        "relationship_skills": { ... },
        "responsible_decision_making": { ... },
        "metacognition": { ... },
        "empathy": { ... },
        "critical_thinking": { ... }
      }
    }
  ]
}
```

**Error Response** (500):
```json
{
  "error": "Failed to fetch scores",
  "message": "Error details"
}
```

### 2. Get Teacher Surveys

Retrieve teacher survey data organized by test period.

**Endpoint**: `GET /api/teacher-surveys`

**Example Request**:
```bash
GET /api/teacher-surveys
```

**Example Response**:
```json
{
  "preTest": {
    "2024-01": {
      "sel_importance_belief": {
        "1": 2,
        "2": 5,
        "3": 10,
        "4": 15,
        "5": 8
      },
      "sel_incorporation_frequency": { ... },
      "sel_confidence_level": { ... },
      "sel_performance_frequency": { ... },
      "disciplinary_issues_frequency": { ... },
      "student_safety_respect_agreement": { ... },
      "student_self_awareness_management": { ... },
      "tilli_curriculum_confidence": { ... }
    }
  },
  "postTest": { ... },
  "post12WeekTest": { ... },
  "post36WeekTest": { ... }
}
```

**Error Response** (500):
```json
{
  "error": "Failed to fetch teacher surveys",
  "message": "Error details"
}
```

### 3. Get Translations

Get complete translation JSON for a specific language.

**Endpoint**: `GET /api/translations/{lang}`

**Path Parameters**:
- `lang` (string): Language code - `en` or `ar`

**Example Request**:
```bash
GET /api/translations/ar
```

**Example Response**:
```json
{
  "common": {
    "home": "الرئيسية",
    "aiChat": "اسأل تيلي",
    "show": "إظهار",
    "hide": "إخفاء"
  },
  "auth": {
    "welcome": "مرحباً بك في تقييم تيلي",
    "signIn": "تسجيل الدخول",
    ...
  },
  "dashboard": { ... },
  "data": { ... },
  ...
}
```

**Error Response** (404):
```json
{
  "error": "Language not supported"
}
```

### 4. List Supported Languages

Get a list of all supported language codes.

**Endpoint**: `GET /api/translations`

**Example Request**:
```bash
GET /api/translations
```

**Example Response**:
```json
{
  "languages": [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English"
    },
    {
      "code": "ar",
      "name": "Arabic",
      "nativeName": "العربية"
    }
  ]
}
```

## Error Handling

All endpoints return standard HTTP status codes:
- `200`: Success
- `404`: Resource not found (e.g., unsupported language)
- `500`: Server error (e.g., Appwrite connection failure)

Error responses include an `error` field with a description, and may include a `message` field with additional details.

## CORS

All endpoints support Cross-Origin Resource Sharing (CORS) with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Integration Example

### JavaScript/TypeScript

```javascript
// Get Arabic translations
const translations = await fetch('https://your-domain.com/api/translations/ar')
  .then(res => res.json());

// Get filtered scores
const scores = await fetch(
  'https://your-domain.com/api/scores?school=azmi_mufti_boys_p1&grade=grade1&assessment=child&section=a&zone=irbid'
).then(res => res.json());

// Get teacher surveys
const surveys = await fetch('https://your-domain.com/api/teacher-surveys')
  .then(res => res.json());
```

### Python

```python
import requests

base_url = 'https://your-domain.com'

# Get translations
translations = requests.get(f'{base_url}/api/translations/ar').json()

# Get scores
scores = requests.get(
  f'{base_url}/api/scores',
  params={
    'school': 'azmi_mufti_boys_p1',
    'grade': 'grade1',
    'assessment': 'child',
    'section': 'a',
    'zone': 'irbid'
  }
).json()

# Get teacher surveys
surveys = requests.get(f'{base_url}/api/teacher-surveys').json()
```

## Testing

For testing purposes without requiring Appwrite connection, use the test endpoints:
- `GET /api/test/scores` - Returns sample score data
- `GET /api/test/teacher-surveys` - Returns sample survey data

These endpoints return mock data that matches the API structure.

## OpenAPI Specification

The complete OpenAPI 3.1.0 specification is available at:
- JSON: `/api/openapi`
- Interactive UI: `/api-docs`

