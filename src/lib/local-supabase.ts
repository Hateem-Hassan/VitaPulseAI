// Browser-compatible mock Supabase client
class LocalSupabaseClient {
  private localStorage = {
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  };
  
  private getStorageKey(table: string, id?: string) {
    return id ? `vitapulse_${table}_${id}` : `vitapulse_${table}`;
  }
  
  private getTableData(table: string): any[] {
    const key = this.getStorageKey(table);
    const data = this.localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  
  private setTableData(table: string, data: any[]) {
    const key = this.getStorageKey(table);
    this.localStorage.setItem(key, JSON.stringify(data));
  }
  
  // Auth methods (mock with localStorage persistence)
  auth = {
    getUser: async () => {
      const user = this.localStorage.getItem('vitapulse_current_user');
      return { 
        data: { user: user ? JSON.parse(user) : null }, 
        error: null 
      };
    },
    getSession: async () => {
      const session = this.localStorage.getItem('vitapulse_session');
      return { 
        data: { session: session ? JSON.parse(session) : null }, 
        error: null 
      };
    },
    signUp: async (credentials: any) => {
      // Mock user creation
      const user = {
        id: Date.now().toString(),
        email: credentials.email,
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString()
      };
      const session = {
        access_token: 'mock_token_' + Date.now(),
        user
      };
      
      this.localStorage.setItem('vitapulse_current_user', JSON.stringify(user));
      this.localStorage.setItem('vitapulse_session', JSON.stringify(session));
      
      return { 
        data: { user, session }, 
        error: null 
      };
    },
    signInWithPassword: async (credentials: any) => {
      // Mock sign in - for demo purposes, any email/password works
      const user = {
        id: Date.now().toString(),
        email: credentials.email,
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString()
      };
      const session = {
        access_token: 'mock_token_' + Date.now(),
        user
      };
      
      this.localStorage.setItem('vitapulse_current_user', JSON.stringify(user));
      this.localStorage.setItem('vitapulse_session', JSON.stringify(session));
      
      return { 
        data: { user, session }, 
        error: null 
      };
    },
    signInWithOAuth: async (options: any) => {
      // Mock OAuth sign in
      const user = {
        id: Date.now().toString(),
        email: `user@${options.provider}.com`,
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString()
      };
      const session = {
        access_token: 'mock_token_' + Date.now(),
        user
      };
      
      this.localStorage.setItem('vitapulse_current_user', JSON.stringify(user));
      this.localStorage.setItem('vitapulse_session', JSON.stringify(session));
      
      return { 
        data: { user, session }, 
        error: null 
      };
    },
    signOut: async () => {
      this.localStorage.removeItem('vitapulse_current_user');
      this.localStorage.removeItem('vitapulse_session');
      return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      // Mock auth state change listener
      return { 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      };
    }
  };
  
  // Database methods
  from(table: string) {
    return {
      select: (columns = '*') => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            try {
              const tableData = this.getTableData(table);
              const data = tableData.find(item => item[column] === value) || null;
              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          },
          limit: (count: number) => ({
            then: async (callback: any) => {
              try {
                const tableData = this.getTableData(table);
                const data = tableData.filter(item => item[column] === value).slice(0, count);
                return callback({ data, error: null });
              } catch (error) {
                return callback({ data: null, error });
              }
            }
          })
        }),
        then: async (callback: any) => {
          try {
            const data = this.getTableData(table);
            return callback({ data, error: null });
          } catch (error) {
            return callback({ data: null, error });
          }
        }
      }),
      insert: (values: any) => ({
        then: async (callback: any) => {
          try {
            const tableData = this.getTableData(table);
            const newItem = {
              id: Date.now().toString(),
              ...values,
              created_at: new Date().toISOString()
            };
            tableData.push(newItem);
            this.setTableData(table, tableData);
            return callback({ data: newItem, error: null });
          } catch (error) {
            return callback({ data: null, error });
          }
        }
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => {
            try {
              const tableData = this.getTableData(table);
              const index = tableData.findIndex(item => item[column] === value);
              if (index !== -1) {
                tableData[index] = {
                  ...tableData[index],
                  ...values,
                  updated_at: new Date().toISOString()
                };
                this.setTableData(table, tableData);
                return callback({ data: tableData[index], error: null });
              }
              return callback({ data: null, error: new Error('Record not found') });
            } catch (error) {
              return callback({ data: null, error });
            }
          }
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (callback: any) => {
            try {
              const tableData = this.getTableData(table);
              const filteredData = tableData.filter(item => item[column] !== value);
              this.setTableData(table, filteredData);
              return callback({ data: { count: tableData.length - filteredData.length }, error: null });
            } catch (error) {
              return callback({ data: null, error });
            }
          }
        })
      })
    };
  }
  
  // Storage methods (mock)
  storage = {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => ({ data: null, error: null }),
      download: async (path: string) => ({ data: null, error: null }),
      remove: async (paths: string[]) => ({ data: null, error: null })
    })
  };
}

export const localSupabase = new LocalSupabaseClient();
export default localSupabase;
