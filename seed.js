const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const MaintenanceTeam = require('./models/MaintenanceTeam');
const Equipment = require('./models/Equipment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MaintenanceTeam.deleteMany({});
    await Equipment.deleteMany({});
    await MaintenanceRequest.deleteMany({});

    console.log('Cleared existing data');

    // Create Users (with passwords)
    const plainUsers = [
      {
        name: 'Praveen Kumar',
        email: 'praveen.kumar@company.com',
        department: 'Production',
        role: 'Manager',
        avatar: 'https://via.placeholder.com/40?text=JS',
        company: 'Acme Corp',
        password: 'password123',
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        department: 'Production',
        role: 'Technician',
        avatar: 'https://via.placeholder.com/40?text=SJ',
        company: 'Acme Corp',
        password: 'password123',
      },
      {
        name: 'Mike Davis',
        email: 'mike.davis@company.com',
        department: 'Maintenance',
        role: 'Technician',
        avatar: 'https://via.placeholder.com/40?text=MD',
        password: 'password123',
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.anderson@company.com',
        department: 'IT',
        role: 'Technician',
        avatar: 'https://via.placeholder.com/40?text=LA',
        company: 'Globex Inc',
        password: 'password123',
      },
      {
        name: 'Robert Wilson',
        email: 'robert.wilson@company.com',
        department: 'Operations',
        role: 'Manager',
        avatar: 'https://via.placeholder.com/40?text=RW',
        company: 'Acme Corp',
        password: 'password123',
      },
    ];

    // Hash passwords and create users
    const usersToInsert = await Promise.all(
      plainUsers.map(async (u) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(u.password, salt);
        return { ...u, password: hash };
      })
    );

    const users = await User.insertMany(usersToInsert);

    console.log(`Created ${users.length} users`);

    // Create Maintenance Teams
    const teams = await MaintenanceTeam.insertMany([
      {
        name: 'Mechanics Team',
        description: 'Responsible for mechanical equipment repairs',
        specialty: 'Mechanics',
        members: [users[1]._id, users[2]._id],
        teamLead: users[0]._id,
      },
      {
        name: 'Electricians',
        description: 'Handles electrical and power issues',
        specialty: 'Electricians',
        members: [users[2]._id],
        teamLead: users[0]._id,
      },
      {
        name: 'IT Support',
        description: 'Computer and IT equipment maintenance',
        specialty: 'IT Support',
        members: [users[3]._id],
        teamLead: users[4]._id,
      },
    ]);

    console.log(`Created ${teams.length} teams`);

    // Equipment seeding removed — equipment will be added manually via the application UI
    // (Keeping seed focused on users and teams only)

    // Maintenance request seeding removed — requests will be created via the application UI as needed

    console.log('\n========================================');
    console.log('Database seeding completed successfully!');
    console.log('========================================\n');

    console.log('Sample Users:');
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\nSample Teams:');
    teams.forEach((team) => {
      console.log(`  - ${team.name} (${team.specialty})`);
    });

    console.log('\nEquipment and requests are intentionally not seeded. Add them via the application UI.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
