# Copilot Instructions for Healthcare Scheduling System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a healthcare scheduling system built with Next.js, TypeScript, Tailwind CSS, and SQLite. The system includes Google Sheets integration for schedule visualization and role-based access control.

## Key Features
- **Schedule Viewing**: Public access to view monthly schedules
- **Schedule Management**: Admin-only access to edit and manage schedules
- **Google Sheets Integration**: Display schedules using Google Sheets API
- **Role-based Authentication**: Different access levels for viewers and administrators
- **SQLite Database**: Local database for user management and schedule data

## Technology Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: Next-Auth.js
- **Google Integration**: Google Sheets API
- **UI Components**: Tailwind CSS with custom components

## Coding Guidelines
- Use TypeScript for all components and API routes
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling with a medical/healthcare theme
- Implement proper error handling and loading states
- Use server components where possible for better performance
- Follow accessibility best practices for healthcare applications

## File Structure
- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and database helpers
- `/src/types` - TypeScript type definitions
- `/database` - SQLite database files and migrations

## Security Considerations
- Implement proper authentication and authorization
- Sanitize all user inputs
- Use environment variables for sensitive data
- Follow HIPAA compliance guidelines where applicable
