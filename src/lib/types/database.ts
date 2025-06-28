export interface Database {
  public: {
    Tables: {
      email_verifications: {
        Row: {
          id: string;
          email: string;
          is_deliverable: boolean;
          is_disposable: boolean;
          is_role_account: boolean;
          is_safe_to_send: boolean;
          mx_accepts_mail: boolean;
          status: string;
          verification_date: string;
          last_checked_at: string;
          check_count: number;
          raw_response: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          is_deliverable: boolean;
          is_disposable: boolean;
          is_role_account: boolean;
          is_safe_to_send: boolean;
          mx_accepts_mail: boolean;
          status: string;
          verification_date?: string;
          last_checked_at?: string;
          check_count?: number;
          raw_response?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          is_deliverable?: boolean;
          is_disposable?: boolean;
          is_role_account?: boolean;
          is_safe_to_send?: boolean;
          mx_accepts_mail?: boolean;
          status?: string;
          verification_date?: string;
          last_checked_at?: string;
          check_count?: number;
          raw_response?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
