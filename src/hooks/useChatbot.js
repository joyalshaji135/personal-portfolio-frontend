import { useState, useEffect } from 'react';
import { chatbotService } from '../services/chatbotService';

export const useChatbot = () => {
  const [aboutData, setAboutData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [stackData, setStackData] = useState(null);
  const [educationData, setEducationData] = useState(null);
  const [experienceData, setExperienceData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [about, contact, stack, education, experience, project] = await Promise.all([
        chatbotService.getAbout().catch(() => ({ data: null })),
        chatbotService.getContact().catch(() => ({ data: null })),
        chatbotService.getStack().catch(() => ({ data: null })),
        chatbotService.getEducation().catch(() => ({ data: null })),
        chatbotService.getExperience().catch(() => ({ data: null })),
        chatbotService.getProject().catch(() => ({ data: null }))
      ]);

      setAboutData(about.data || null);
      setContactData(contact.data || null);
      setStackData(stack.data || null);
      setEducationData(education.data || null);
      setExperienceData(experience.data || null);
      setProjectData(project.data || null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching chatbot data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    aboutData,
    contactData,
    stackData,
    educationData,
    experienceData,
    projectData,
    loading,
    error,
    fetchAllData
  };
};