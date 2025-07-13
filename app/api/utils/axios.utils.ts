import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponseType } from '@/app/types/response.type';


export class AxiosApiClient {
  private baseURL: string;
  
  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || '';
    
    // axios 인터셉터 설정 (선택사항)
    axios.defaults.timeout = 10000; // 10초 타임아웃
  }

  private getHeaders(accessToken?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (accessToken) {
      headers['Authorization'] = accessToken;
    }
    
    return headers;
  }

  private handleError(error: any, endpoint: string): ApiResponseType<any> {
    console.error(`API 요청 오류 (${endpoint}):`, error);
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // 서버가 응답했지만 2xx 범위를 벗어남
        const responseData = axiosError.response.data as any;
        return {
          success: false,
          message: responseData?.message || `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`,
        };
      } else if (axiosError.request) {
        // 요청은 만들어졌지만 응답을 받지 못함
        return {
          success: false,
          message: '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.',
        };
      }
    }
    
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    };
  }

  async get<T>(endpoint: string, accessToken?: string, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> {
    try {
      const response: AxiosResponse<ApiResponseType<T>> = await axios.get(
        `${this.baseURL}${endpoint}`,
        {
          headers: this.getHeaders(accessToken),
          ...config,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }

  async post<T>(
    endpoint: string, 
    body?: any, 
    accessToken?: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<T>> {
    try {
      const response: AxiosResponse<ApiResponseType<T>> = await axios.post(
        `${this.baseURL}${endpoint}`,
        body,
        {
          headers: this.getHeaders(accessToken),
          ...config,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }

  async put<T>(
    endpoint: string, 
    body?: any, 
    accessToken?: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<T>> {
    try {
      const response: AxiosResponse<ApiResponseType<T>> = await axios.put(
        `${this.baseURL}${endpoint}`,
        body,
        {
          headers: this.getHeaders(accessToken),
          ...config,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }

  async delete<T>(endpoint: string, accessToken?: string, config?: AxiosRequestConfig): Promise<ApiResponseType<T>> {
    try {
      const response: AxiosResponse<ApiResponseType<T>> = await axios.delete(
        `${this.baseURL}${endpoint}`,
        {
          headers: this.getHeaders(accessToken),
          ...config,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }

  async patch<T>(
    endpoint: string, 
    body?: any, 
    accessToken?: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponseType<T>> {
    try {
      const response: AxiosResponse<ApiResponseType<T>> = await axios.patch(
        `${this.baseURL}${endpoint}`,
        body,
        {
          headers: this.getHeaders(accessToken),
          ...config,
        }
      );

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return this.handleError(error, endpoint);
    }
  }
}

// 싱글톤 인스턴스 생성
export const axiosApiClient = new AxiosApiClient();