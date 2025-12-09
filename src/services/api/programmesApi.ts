export interface Programme {
  id: string;
  date: string;
  topic: string;
  time: string;
  status: 'upcoming' | 'past';
  type: 'shilo' | 'sunday' | 'vigil';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgrammesApiResponse {
  success: boolean;
  data?: Programme[];
  count?: number;
  error?: string;
  message?: string;
}

export interface ProgrammeApiResponse {
  success: boolean;
  data?: Programme;
  error?: string;
  message?: string;
}

// GET /api/programmes - Fetch all programmes with optional filters
export async function fetchProgrammes(params?: {
  status?: string;
  type?: string;
}): Promise<Programme[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);

    const url = `/api/programmes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    const data: ProgrammesApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch programmes');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching programmes:', error);
    throw error;
  }
}

// GET /api/programmes/[id] - Fetch single programme
export async function fetchProgrammeById(id: string): Promise<Programme | null> {
  try {
    const response = await fetch(`/api/programmes/${id}`);
    const data: ProgrammeApiResponse = await response.json();

    if (!data.success) {
      if (response.status === 404) return null;
      throw new Error(data.error || 'Failed to fetch programme');
    }

    return data.data || null;
  } catch (error) {
    console.error('Error fetching programme:', error);
    throw error;
  }
}

// POST /api/programmes - Create new programme
export async function createProgrammeApi(programmeData: any): Promise<Programme> {
  try {
    const response = await fetch('/api/programmes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programmeData),
    });

    const data: ProgrammeApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create programme');
    }

    return data.data!;
  } catch (error) {
    console.error('Error creating programme:', error);
    throw error;
  }
}

// PATCH /api/programmes/[id] - Update programme
export async function updateProgrammeApi(id: string, updates: any): Promise<Programme> {
  try {
    const response = await fetch(`/api/programmes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data: ProgrammeApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to update programme');
    }

    return data.data!;
  } catch (error) {
    console.error('Error updating programme:', error);
    throw error;
  }
}

// DELETE /api/programmes/[id] - Delete programme
export async function deleteProgrammeApi(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/programmes/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to delete programme');
    }
  } catch (error) {
    console.error('Error deleting programme:', error);
    throw error;
  }
}
