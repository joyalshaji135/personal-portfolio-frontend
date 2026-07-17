import axiosInstance from '../utils/axiosInterceptor';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/';

export const userMessagesService = {
  // Get All Messages
  getAll: async () => {
    // Mock data - Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          message: 'Messages fetched successfully',
          data: mockMessages
        });
      }, 800);
    });
  },

  // Get Single Message
  getById: async (id) => {
    // Mock data - Replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const message = mockMessages.find(m => m._id === id);
        if (message) {
          resolve({
            status: true,
            message: 'Message fetched successfully',
            data: message
          });
        } else {
          reject({
            status: false,
            message: 'Message not found'
          });
        }
      }, 500);
    });
  }
};

// Mock Messages Data
const mockMessages = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    subject: "Project Inquiry - Web Development",
    message: "I came across your portfolio and I'm really impressed with your work. We're looking for a skilled developer to help us build a new e-commerce platform. Would you be interested in discussing this opportunity?",
    status: "unread",
    priority: "high",
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
    phone: "+1 (555) 123-4567",
    source: "Portfolio Website",
    isStarred: true
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Collaboration Opportunity",
    message: "Hi there! I'm reaching out to see if you'd be interested in collaborating on an open-source project I'm working on. It's a React-based tool for developers.",
    status: "read",
    priority: "medium",
    createdAt: "2024-06-14T14:20:00Z",
    updatedAt: "2024-06-14T16:45:00Z",
    phone: "+1 (555) 987-6543",
    source: "LinkedIn",
    isStarred: false
  },
  {
    _id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    subject: "Speaking Engagement Request",
    message: "We're organizing a tech conference in San Francisco and would love to have you as a speaker. Your experience with full-stack development would be perfect for our audience.",
    status: "unread",
    priority: "high",
    createdAt: "2024-06-13T09:15:00Z",
    updatedAt: "2024-06-13T09:15:00Z",
    phone: "+1 (555) 456-7890",
    source: "Email",
    isStarred: true
  },
  {
    _id: "4",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    subject: "Job Opportunity - Senior Developer",
    message: "We're looking for a senior developer to join our team at TechStart Inc. Your skills and experience would be a great fit for our growing company.",
    status: "read",
    priority: "low",
    createdAt: "2024-06-12T16:00:00Z",
    updatedAt: "2024-06-12T18:30:00Z",
    phone: "+1 (555) 789-0123",
    source: "LinkedIn",
    isStarred: false
  },
  {
    _id: "5",
    name: "David Chen",
    email: "david@example.com",
    subject: "Feedback on Portfolio",
    message: "I love your portfolio! The design is clean and modern. I was particularly impressed with the project showcase section. Just wanted to share my appreciation.",
    status: "unread",
    priority: "low",
    createdAt: "2024-06-11T11:30:00Z",
    updatedAt: "2024-06-11T11:30:00Z",
    phone: "+1 (555) 321-6547",
    source: "Portfolio Website",
    isStarred: false
  },
  {
    _id: "6",
    name: "Emily Brown",
    email: "emily@example.com",
    subject: "Freelance Project - Mobile App",
    message: "We're looking for a freelancer to develop a mobile app for our startup. The app will be built with React Native. Do you have experience with mobile development?",
    status: "read",
    priority: "medium",
    createdAt: "2024-06-10T08:45:00Z",
    updatedAt: "2024-06-10T10:20:00Z",
    phone: "+1 (555) 654-3210",
    source: "Upwork",
    isStarred: false
  },
  {
    _id: "7",
    name: "Robert Taylor",
    email: "robert@example.com",
    subject: "Mentorship Inquiry",
    message: "I'm a junior developer looking for a mentor. I've been following your work and would love to learn from you. Could we schedule a call to discuss?",
    status: "unread",
    priority: "medium",
    createdAt: "2024-06-09T15:30:00Z",
    updatedAt: "2024-06-09T15:30:00Z",
    phone: "+1 (555) 987-1234",
    source: "LinkedIn",
    isStarred: false
  }
];