import fs from 'fs';
import path from 'path';

console.log('🚀 Initiating Pre-Deployment Environment Verification...');

const envExamplePath = path.resolve(process.cwd(), '.env.example');
if (!fs.existsSync(envExamplePath)) {
  console.log('📝 No .env.example found. Skipping validation.');
  process.exit(0);
}

const content = fs.readFileSync(envExamplePath, 'utf-8');
const lines = content.split('\n');
const envVars = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const match = trimmed.match(/^([^=]+)=/);
    if (match) {
      envVars.push(match[1].trim());
    }
  }
}

console.log(`📋 Found ${envVars.length} environment variables to check from .env.example.`);

let hasMissingCritical = false;
const criticalVars = ['GEMINI_API_KEY'];

for (const envVar of envVars) {
  const val = process.env[envVar];
  const isPlaceholder = val === `MY_${envVar}` || (envVar === 'GEMINI_API_KEY' && val === 'MY_GEMINI_API_KEY');
  
  if (!val || val.trim() === '' || isPlaceholder) {
    if (criticalVars.includes(envVar)) {
      console.warn(`❌ CRITICAL MISSING: "${envVar}" is NOT mapped or has a placeholder value.`);
      console.warn(`   Please define this variable in the Google AI Studio Secrets panel or Cloud Run Environment variables.`);
      hasMissingCritical = true;
    } else {
      console.log(`⚠️  OPTIONAL MISSING: "${envVar}" is not mapped. Default or demo settings will be used.`);
    }
  } else {
    // Hide actual keys for security reasons
    const displayVal = val.length > 8 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : '***';
    console.log(`✅ MAPPED: "${envVar}" is active (${displayVal}).`);
  }
}

if (hasMissingCritical) {
  console.log('\n🚨 WARNING: Critical deployment variables are missing. Live chatbot service will run in offline sandbox mode unless mapped in production.');
} else {
  console.log('\n✨ All critical environment variables are successfully resolved and mapped for live production!');
}
