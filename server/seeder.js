import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import colors from 'colors'; // Removed to avoid dependency error
import users from './data/users.js';
import classes from './data/classes.js';
import lessons from './data/lessons.js';
import exercises from './data/exercises.js';
import documents from './data/documents.js';
import User from './models/User.js';
import Class from './models/Class.js';
import Lesson from './models/Lesson.js';
import Exercise from './models/Exercise.js';
import Document from './models/Document.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Class.deleteMany();
        await Lesson.deleteMany();
        await Exercise.deleteMany();
        await Document.deleteMany();

        console.log('Data Destroyed...');

        // Import Classes First
        const createdClasses = await Class.insertMany(classes);
        const class6A1 = createdClasses[0]._id;

        // Import Users (Need to attach class to student)
        const adminUser = users[0];
        const studentUser = { ...users[1], class: class6A1 };

        await User.create(adminUser); // Create triggers save middleware (hashing)
        await User.create(studentUser);

        console.log('Users & Classes Imported...');

        // Import Lessons
        await Lesson.insertMany(lessons);
        console.log('Lessons Imported...');

        // Import Exercises
        await Exercise.insertMany(exercises);
        console.log('Exercises Imported...');

        // Import Documents
        await Document.insertMany(documents);
        console.log('Documents Imported...');

        console.log('DATA IMPORTED SUCCESS!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Class.deleteMany();
        await Lesson.deleteMany();
        await Exercise.deleteMany();
        await Document.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
