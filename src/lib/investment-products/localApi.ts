'use server';

import { getPayload } from 'payload';
import config from '@payload-config';

type TermMappingKeys = 'monthly' | 'quarterly' | 'semester' | 'annually';

export const getProducts = async () => {
  const standardApplyProgramDays = 90; // Define the standard apply program days
  try {
    // Initialize Payload
    const payload = await getPayload({ config });

    // Fetch investment products
    const response = await payload.find({
      collection: 'investment-products',
      where: {}, // Optional: Add filters if needed
    });

    // Handle empty response
    if (!response || !response.docs || response.docs.length === 0) {
      console.warn('No investment products found.');
      return [];
    }

    // Map the API response to match the rateConfig format
    const formattedRateConfig = response.docs.map((item) => {
      const termMapping = {
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        semester: 'Semester',
        annually: 'Annually',
      };
      return {
        product_id: item.id,
        term: termMapping[item.term as TermMappingKeys] || item.term, // Map term to the desired format
        rate: item.rate_of_return / 100, // Convert percentage to decimal
        text: termMapping[item.term as TermMappingKeys] || item.term,
        isShowForm: true, // Default visibility in form
      };
    });

    // Define the final rateConfig
    const rateConfig = [
      { term: 'partialMonth', rate: 0.04, text: 'Partial Month', isShowForm: false },
      ...formattedRateConfig, // Include dynamically fetched terms
      {
        term: 'BeforeStandard',
        rate: 0.2 / 12,
        text: `Before Standard ${standardApplyProgramDays} days`,
        isShowForm: false,
      },
    ];

    return rateConfig; // Return the final rateConfig
  } catch (error) {
    console.error('Error fetching contracts:', error);
    throw new Error('Failed to fetch and process investment products.');
  }
};