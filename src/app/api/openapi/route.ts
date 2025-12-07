import { readFileSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'openapi.yaml');
    const fileContents = readFileSync(filePath, 'utf8');
    const spec = yaml.load(fileContents);
    
    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to load OpenAPI specification' },
      { status: 500 }
    );
  }
}

