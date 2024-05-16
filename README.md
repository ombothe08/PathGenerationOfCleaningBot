# Path Generation for Cleaning Bot

## Table of Contents
- [Introduction](##Indroduction)
- [System Overview](#SystemOverview)
- [Tools](#Tools)
- [Usage](#Usage)
- [Future Improvements](#FutureImprovements)
- [Summary](#Summary)

## Introduction

## Purpose
The purpose of the Path Generation for Cleaning Bot project is to create an intuitive user interface where users can define the boundaries of their cleaning area. The system generates a path for the cleaning bot to follow within the defined boundary, ensuring comprehensive coverage while avoiding obstacles and outer boundaries.

## Scope
This project aims to develop a user-friendly web application enabling users to visually outline the boundaries of their indoor spaces for cleaning purposes. The system will generate an efficient cleaning path for a bot to navigate within the specified boundary, avoiding obstacles and outer edges.

## System Overview
The web-based application, built with React and TypeScript on the frontend, allows users to define boundaries of their cleaning area. To store the relevant data in a data structure using typescript.

## Tools

- **Frontend:** React with TypeScript for web frontend 
- **Rendering:** Three.js
- **IDE:** Visual Studio Code
- **CSS:** Cascading Style Sheet

## Usage

### Installation

1. Clone the repository to your local machine: `git clone https://github.com/ombothe08/PathGenerationOfCleaningBot.git`
2. Navigate to the project directory
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Future Improvements

1. **Multi-Room Support:**
   - Allow users to draw multiple rooms of closed shapes within a house layout. Users should be able to define the boundaries of each room separately.
   
2. **Selective Room Cleaning:**
   - Implement a panel on the right side of the screen where users can select which room(s) to clean. Options could include cleaning the entire house, cleaning only one specific room, or selecting multiple rooms for cleaning.
   
3. **Mobile Application Compatibility:**
   - Develop a companion mobile application to provide users with more flexibility in monitoring the cleaning process from their smartphone.

## Summary

The Path Generation for Cleaning Bot project utilizes modern web technologies to create a user-friendly application. By combining React with TypeScript for the frontend, the system simplifies the process of defining cleaning boundaries and generating optimized paths. With features like obstacle detection, cleaning pattern selection, and recharge station integration, it ensures efficient cleaning operations while providing a seamless user experience.
