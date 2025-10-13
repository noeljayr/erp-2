import { BASE_URL } from '~/constants/base-url';
import { closeModal } from '#imports';
import { useRefreshStore } from '#imports';
import { capitalize } from '#imports';

interface Query {
  setLoading: (state: boolean) => void;
  setError: (state: boolean) => void;
  setSuccess: (state: boolean) => void;
  setStatusMessage: (message: string) => void;
}

interface GET {
  setLoading: (state: boolean) => void;
  setError: (state: boolean) => void;
  setData: (data: any) => void;
  page?: number;
  search?: string;
  status?: string;
  limit?: number;
}

export const requestFunds = async ({
  setLoading,
  setSuccess,
  setError,
  setStatusMessage,
}: Query) => {
  const token = useAuthStore();

  if (!token) throw new Error('Not authorized');

  try {
    setLoading(true);
    setSuccess(false);
    setError(false);

    if (!token) throw new Error('Not authorized');

    const formData = useRequestFormData();

    const approver_id = formData.approver_id;
    const amount = formData.amount;
    const currency = formData.currency;
    const description = formData.description;
    const purpose = formData.purpose;
    const required_on = formData.required_on;

    const response = await fetch(`${BASE_URL}/requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        approver_id,
        amount,
        currency,
        description,
        purpose,
        required_on,
      }),
    });

    const data = await response.json();

    if (response.status == 201) {
      setSuccess(true);
      // refreshStore.setRefresh();

      // emailjs.init('gX3LSF-KrqtkWcAuO')

      // emailjs.send('service_2jfk01f', 'template_zsumwin', {
      //   purpose: `${purpose}`,
      //   amount: `${currency === "USD" ? "$" : "K"}${amount}`,
      //   id: data._id,
      //   email: ['noeljayr01@gmail.com', 'noeljayrluhanga@gmail.com'],
      //   name: `${userName}`,
      // });

      //reset form data
      formData.approver_id = '';
      formData.amount = 0;
      formData.currency = 'MWK';
      formData.description = '';
      formData.purpose = '';
      formData.required_on = '';

      useRefreshStore().setRefresh();

      window.setTimeout(() => {
        closeModal('new-request');
      }, 500);
    } else {
      setError(true);
      setStatusMessage(data.message);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};

export const getRequests = async ({
  setLoading,
  setError,
  setData,
  page,
  search,
  status,
  limit,
}: GET) => {
  const token = useAuthStore();

  if (!token) throw new Error('Not authorized');

  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (status) params.append('status', capitalize(status));
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));

  const endpoint = `${BASE_URL}/requests?${params.toString()}`;

  try {
    setLoading(true);
    setError(false);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token}`,
      },
    });

    const data = await response.json();

    if (response.status == 200) {
      setData(data);
      setLoading(false);
    } else {
      setError(true);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};

interface UPDATE_STATUS extends Query {
  status: 'Approved' | 'Rejected';
  id: string;
}

export const updateStatus = async ({
  setError,
  setLoading,
  setStatusMessage,
  setSuccess,
  status,
  id,
}: UPDATE_STATUS) => {
  setSuccess(false);
  setError(false);
  setLoading(false);
  setStatusMessage('');

  try {
    setLoading(true);

    const token = useAuthStore();

    const response = await fetch(`${BASE_URL}/requests/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    if (response.status == 200) {
      setSuccess(true);
      useRefreshStore().setRefresh();

      window.setTimeout(() => {
        closeModal('view-request');
        closeModal('requestId');
      }, 500);
    } else {
      setError(true);
    }
  } catch (e: any) {
    setError(true);
    console.log(e);
  } finally {
    setLoading(false);
  }
};


export const updateRequest = async ({
  setLoading,
  setSuccess,
  setError,
  setStatusMessage,
}: Query) => {
  const token = useAuthStore();

  if (!token) throw new Error('Not authorized');

  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const id = params.get('requestId');

  if (!id) {
    setError(true);
    setStatusMessage?.('requestId missing from URL');
    return;
  }

  try {
    setLoading(true);
    setSuccess(false);
    setError(false);

    if (!token) throw new Error('Not authorized');

    const formData = useViewRequestFormData();

    const approver_id = formData.approver_id;
    const amount = formData.amount;
    const currency = formData.currency;
    const description = formData.description;
    const purpose = formData.purpose;
    const required_on = formData.required_on;

    const response = await fetch(`${BASE_URL}/requests/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token}`,
      },
      body: JSON.stringify({
        approver_id,
        amount,
        currency,
        description,
        purpose,
        required_on,
      }),
    });

    const data = await response.json();

    if (response.status == 200) {
      setSuccess(true);
      formData.approver_id = '';
      formData.amount = 0;
      formData.currency = 'MWK';
      formData.description = '';
      formData.purpose = '';
      formData.required_on = '';

      useRefreshStore().setRefresh();

      window.setTimeout(() => {
        closeModal('view-request');
        closeModal('requestId');
      }, 500);
    } else {
      setError(true);
      setStatusMessage(data.message);
    }
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};
