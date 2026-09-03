export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          certificate_number: string
          id: string
          issued_at: string
          match_id: string
          root_hash: string
          status: string
          verifier_url: string
        }
        Insert: {
          certificate_number: string
          id?: string
          issued_at?: string
          match_id: string
          root_hash: string
          status?: string
          verifier_url: string
        }
        Update: {
          certificate_number?: string
          id?: string
          issued_at?: string
          match_id?: string
          root_hash?: string
          status?: string
          verifier_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "trade_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      counterparties: {
        Row: {
          created_at: string
          entity_type: string
          id: string
          jurisdiction: string
          kyc_status: string
          legal_name: string
          lei: string | null
          onboarded_at: string
          risk_tier: string
          short_code: string
        }
        Insert: {
          created_at?: string
          entity_type: string
          id?: string
          jurisdiction: string
          kyc_status?: string
          legal_name: string
          lei?: string | null
          onboarded_at?: string
          risk_tier?: string
          short_code: string
        }
        Update: {
          created_at?: string
          entity_type?: string
          id?: string
          jurisdiction?: string
          kyc_status?: string
          legal_name?: string
          lei?: string | null
          onboarded_at?: string
          risk_tier?: string
          short_code?: string
        }
        Relationships: []
      }
      evidence_packs: {
        Row: {
          document_type: string
          filename: string
          gate_number: number | null
          id: string
          match_id: string
          sha256: string
          size_bytes: number
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          document_type: string
          filename: string
          gate_number?: number | null
          id?: string
          match_id: string
          sha256: string
          size_bytes: number
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          document_type?: string
          filename?: string
          gate_number?: number | null
          id?: string
          match_id?: string
          sha256?: string
          size_bytes?: number
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_packs_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "trade_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_events: {
        Row: {
          actor: string
          created_at: string
          gate_name: string
          gate_number: number
          hash: string | null
          id: string
          match_id: string
          sealed_at: string | null
          status: string
        }
        Insert: {
          actor: string
          created_at?: string
          gate_name: string
          gate_number: number
          hash?: string | null
          id?: string
          match_id: string
          sealed_at?: string | null
          status?: string
        }
        Update: {
          actor?: string
          created_at?: string
          gate_name?: string
          gate_number?: number
          hash?: string | null
          id?: string
          match_id?: string
          sealed_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "trade_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          currency: string
          features: Json
          id: string
          match_allowance: string
          monthly_price: number | null
          name: string
          slug: string
          sort_order: number
          tagline: string
        }
        Insert: {
          currency?: string
          features?: Json
          id?: string
          match_allowance: string
          monthly_price?: number | null
          name: string
          slug: string
          sort_order?: number
          tagline: string
        }
        Update: {
          currency?: string
          features?: Json
          id?: string
          match_allowance?: string
          monthly_price?: number | null
          name?: string
          slug?: string
          sort_order?: number
          tagline?: string
        }
        Relationships: []
      }
      status_incidents: {
        Row: {
          body: string
          id: string
          impact: string
          resolved_at: string | null
          service_id: string
          started_at: string
          status: string
          title: string
        }
        Insert: {
          body: string
          id?: string
          impact: string
          resolved_at?: string | null
          service_id: string
          started_at: string
          status?: string
          title: string
        }
        Update: {
          body?: string
          id?: string
          impact?: string
          resolved_at?: string | null
          service_id?: string
          started_at?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_incidents_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "status_services"
            referencedColumns: ["id"]
          },
        ]
      }
      status_services: {
        Row: {
          description: string
          id: string
          name: string
          slug: string
          sort_order: number
          status: string
          uptime_90d: number
        }
        Insert: {
          description: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          status?: string
          uptime_90d?: number
        }
        Update: {
          description?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: string
          uptime_90d?: number
        }
        Relationships: []
      }
      trade_matches: {
        Row: {
          buyer_id: string
          commodity: string
          created_at: string
          currency: string
          gates_cleared: number
          id: string
          incoterm: string
          notional_value: number
          opened_at: string
          price_per_unit: number
          quantity: number
          reference: string
          seller_id: string
          settled_at: string | null
          status: string
          unit: string
        }
        Insert: {
          buyer_id: string
          commodity: string
          created_at?: string
          currency?: string
          gates_cleared?: number
          id?: string
          incoterm: string
          notional_value: number
          opened_at?: string
          price_per_unit: number
          quantity: number
          reference: string
          seller_id: string
          settled_at?: string | null
          status?: string
          unit: string
        }
        Update: {
          buyer_id?: string
          commodity?: string
          created_at?: string
          currency?: string
          gates_cleared?: number
          id?: string
          incoterm?: string
          notional_value?: number
          opened_at?: string
          price_per_unit?: number
          quantity?: number
          reference?: string
          seller_id?: string
          settled_at?: string | null
          status?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_matches_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "counterparties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_matches_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "counterparties"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          attempts: number
          delivered: boolean
          endpoint_url: string
          event_type: string
          id: string
          match_id: string | null
          occurred_at: string
          response_code: number | null
        }
        Insert: {
          attempts?: number
          delivered?: boolean
          endpoint_url: string
          event_type: string
          id?: string
          match_id?: string | null
          occurred_at?: string
          response_code?: number | null
        }
        Update: {
          attempts?: number
          delivered?: boolean
          endpoint_url?: string
          event_type?: string
          id?: string
          match_id?: string | null
          occurred_at?: string
          response_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "trade_matches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
