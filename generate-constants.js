/**
 * Generates TypeScript constants from C# PermissionKeys.cs
 * 
 * This script reads the backend C# constants and generates a TypeScript file
 * to ensure frontend and backend stay in sync.
 * 
 * Usage: node generate-constants.js
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, 'Template.Data/Constants/PermissionKeys.cs');
const OUTPUT_FILE = path.join(__dirname, 'Template.Client/src/config/generated/permissionKeys.generated.ts');

function parsePermissionKeys(content) {
  const permissions = {};
  const roles = {};

  // Find the PermissionKeys class content
  const permissionKeysMatch = content.match(/public static class PermissionKeys\s*\{([\s\S]*?)\n\s*\/\/\//);
  
  if (permissionKeysMatch) {
    const permissionKeysBody = permissionKeysMatch[1];
    
    // Match nested static class blocks
    const nestedClassRegex = /public static class (\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = nestedClassRegex.exec(permissionKeysBody)) !== null) {
      const className = match[1];
      const classBody = match[2];

      // Match const string declarations
      const constRegex = /public const string (\w+) = "([^"]+)"/g;
      let constMatch;
      const classConstants = {};

      while ((constMatch = constRegex.exec(classBody)) !== null) {
        const constName = constMatch[1];
        const constValue = constMatch[2];
        classConstants[constName] = constValue;
      }

      if (Object.keys(classConstants).length > 0) {
        permissions[className] = classConstants;
      }
    }
  }

  // Parse RoleNames class
  const roleNamesMatch = content.match(/public static class RoleNames\s*\{([^}]+)\}/);
  if (roleNamesMatch) {
    const roleBody = roleNamesMatch[1];
    const constRegex = /public const string (\w+) = "([^"]+)"/g;
    let constMatch;

    while ((constMatch = constRegex.exec(roleBody)) !== null) {
      roles[constMatch[1]] = constMatch[2];
    }
  }

  return { permissions, roles };
}

function generateTypeScript(data) {
  const { permissions, roles } = data;
  const timestamp = new Date().toISOString();

  let output = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * 
 * Generated from: Template.Data/Constants/PermissionKeys.cs
 * Generated at: ${timestamp}
 * 
 * To regenerate: node generate-constants.js
 */

/**
 * Permission Keys - Single source of truth for all permission constants.
 * These match the backend C# PermissionKeys class exactly.
 */
export const PERMISSION_KEYS = {
`;

  for (const [className, constants] of Object.entries(permissions)) {
    output += `  ${className.toUpperCase()}: {\n`;
    for (const [constName, constValue] of Object.entries(constants)) {
      // Convert PascalCase to UPPER_SNAKE_CASE for TypeScript
      const tsName = constName.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
      output += `    ${tsName}: "${constValue}",\n`;
    }
    output += `  },\n`;
  }

  output += `} as const;

/**
 * Role Names - Single source of truth for all role name constants.
 */
export const ROLE_NAMES = {
`;

  for (const [name, value] of Object.entries(roles)) {
    const tsName = name.replace(/([A-Z])/g, '_$1').toUpperCase().replace(/^_/, '');
    output += `  ${tsName}: "${value}",\n`;
  }

  output += `} as const;

/**
 * Type helpers for type-safe permission checking
 */
export type PermissionKey = typeof PERMISSION_KEYS[keyof typeof PERMISSION_KEYS][keyof typeof PERMISSION_KEYS[keyof typeof PERMISSION_KEYS]];
export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];

/**
 * Flat array of all permission keys (for validation)
 */
export const ALL_PERMISSION_KEYS: PermissionKey[] = Object.values(PERMISSION_KEYS).flatMap(
  category => Object.values(category)
) as PermissionKey[];
`;

  return output;
}

function main() {
  console.log('🔄 Generating TypeScript constants from C# source...');

  // Read source file
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`❌ Source file not found: ${SOURCE_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(SOURCE_FILE, 'utf8');
  console.log(`📖 Read source file: ${SOURCE_FILE}`);

  // Parse C# content
  const data = parsePermissionKeys(content);
  console.log(`📊 Found ${Object.keys(data.permissions).length} permission categories`);
  console.log(`📊 Found ${Object.keys(data.roles).length} role names`);

  // Generate TypeScript
  const tsContent = generateTypeScript(data);

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write output file
  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`✅ Generated: ${OUTPUT_FILE}`);

  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Update imports in your frontend code to use the generated file');
  console.log('   2. Run this script whenever you update PermissionKeys.cs');
}

main();
