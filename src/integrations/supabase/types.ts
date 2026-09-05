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
      ai_analyses: {
        Row: {
          created_at: string
          id: string
          output: Json
          search_run_id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          output?: Json
          search_run_id: string
          transaction_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          output?: Json
          search_run_id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_analyses_search_run_id_fkey"
            columns: ["search_run_id"]
            isOneToOne: false
            referencedRelation: "search_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analyses_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string
          detail: Json
          event: string
          id: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          created_at?: string
          detail?: Json
          event: string
          id?: string
          user_id?: string
          workspace_id?: string | null
        }
        Update: {
          created_at?: string
          detail?: Json
          event?: string
          id?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_offers: {
        Row: {
          actor_person: string | null
          commercial: Json
          contact: string | null
          created_at: string
          id: string
          parent_id: string | null
          represented_org: string | null
          role: string | null
          subject_description: string | null
          subject_type: string | null
          transaction_id: string
          user_id: string
          version: number
        }
        Insert: {
          actor_person?: string | null
          commercial?: Json
          contact?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          represented_org?: string | null
          role?: string | null
          subject_description?: string | null
          subject_type?: string | null
          transaction_id: string
          user_id?: string
          version?: number
        }
        Update: {
          actor_person?: string | null
          commercial?: Json
          contact?: string | null
          created_at?: string
          id?: string
          parent_id?: string | null
          represented_org?: string | null
          role?: string | null
          subject_description?: string | null
          subject_type?: string | null
          transaction_id?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "bid_offers_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
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
      choices: {
        Row: {
          actor: string
          counterparty_set_id: string
          created_at: string
          id: string
          reason: string | null
          selected_entity: Json
          transaction_id: string
          user_id: string
        }
        Insert: {
          actor: string
          counterparty_set_id: string
          created_at?: string
          id?: string
          reason?: string | null
          selected_entity?: Json
          transaction_id: string
          user_id?: string
        }
        Update: {
          actor?: string
          counterparty_set_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          selected_entity?: Json
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "choices_counterparty_set_id_fkey"
            columns: ["counterparty_set_id"]
            isOneToOne: false
            referencedRelation: "counterparty_sets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "choices_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      counterparties: {
        Row: {
          approved_to_trade: boolean
          authority_to_bind: boolean
          created_at: string
          entity_type: string
          id: string
          jurisdiction: string
          kyc_status: string
          legal_name: string
          lei: string | null
          onboarded_at: string
          risk_band: string
          risk_tier: string
          screened_at: string | null
          screening_result: string
          short_code: string
          ubo_disclosed: boolean
        }
        Insert: {
          approved_to_trade?: boolean
          authority_to_bind?: boolean
          created_at?: string
          entity_type: string
          id?: string
          jurisdiction: string
          kyc_status?: string
          legal_name: string
          lei?: string | null
          onboarded_at?: string
          risk_band?: string
          risk_tier?: string
          screened_at?: string | null
          screening_result?: string
          short_code: string
          ubo_disclosed?: boolean
        }
        Update: {
          approved_to_trade?: boolean
          authority_to_bind?: boolean
          created_at?: string
          entity_type?: string
          id?: string
          jurisdiction?: string
          kyc_status?: string
          legal_name?: string
          lei?: string | null
          onboarded_at?: string
          risk_band?: string
          risk_tier?: string
          screened_at?: string | null
          screening_result?: string
          short_code?: string
          ubo_disclosed?: boolean
        }
        Relationships: []
      }
      counterparty_sets: {
        Row: {
          created_at: string
          decision_session_id: string
          entities: Json
          id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decision_session_id: string
          entities?: Json
          id?: string
          transaction_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          decision_session_id?: string
          entities?: Json
          id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counterparty_sets_decision_session_id_fkey"
            columns: ["decision_session_id"]
            isOneToOne: false
            referencedRelation: "decision_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counterparty_sets_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_sessions: {
        Row: {
          ai_analysis_id: string
          choice_set: Json | null
          created_at: string
          id: string
          status: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          ai_analysis_id: string
          choice_set?: Json | null
          created_at?: string
          id?: string
          status?: string
          transaction_id: string
          user_id?: string
        }
        Update: {
          ai_analysis_id?: string
          choice_set?: Json | null
          created_at?: string
          id?: string
          status?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_sessions_ai_analysis_id_fkey"
            columns: ["ai_analysis_id"]
            isOneToOne: false
            referencedRelation: "ai_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decision_sessions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
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
      executions: {
        Row: {
          baseline: Json | null
          completed_at: string | null
          created_at: string
          id: string
          status: string
          transaction_id: string
          user_id: string
          wad_id: string
        }
        Insert: {
          baseline?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          transaction_id: string
          user_id?: string
          wad_id: string
        }
        Update: {
          baseline?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          transaction_id?: string
          user_id?: string
          wad_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "executions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "executions_wad_id_fkey"
            columns: ["wad_id"]
            isOneToOne: false
            referencedRelation: "wads"
            referencedColumns: ["id"]
          },
        ]
      }
      finality_records: {
        Row: {
          canonical_hash: string | null
          certificate: Json | null
          created_at: string
          execution_id: string
          finality_type: string
          id: string
          issued_at: string | null
          status: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          canonical_hash?: string | null
          certificate?: Json | null
          created_at?: string
          execution_id: string
          finality_type?: string
          id?: string
          issued_at?: string | null
          status?: string
          transaction_id: string
          user_id?: string
        }
        Update: {
          canonical_hash?: string | null
          certificate?: Json | null
          created_at?: string
          execution_id?: string
          finality_type?: string
          id?: string
          issued_at?: string | null
          status?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "finality_records_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "executions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finality_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
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
      intents: {
        Row: {
          choice_id: string
          completion_probability: number | null
          created_at: string
          frozen_snapshot: Json
          id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          choice_id: string
          completion_probability?: number | null
          created_at?: string
          frozen_snapshot: Json
          id?: string
          transaction_id: string
          user_id?: string
        }
        Update: {
          choice_id?: string
          completion_probability?: number | null
          created_at?: string
          frozen_snapshot?: Json
          id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intents_choice_id_fkey"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "choices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_events: {
        Row: {
          event_hash: string
          event_type: string
          id: string
          occurred_at: string
          payload: Json
          prev_hash: string | null
          seq: number
          transaction_id: string
          user_id: string
        }
        Insert: {
          event_hash: string
          event_type: string
          id?: string
          occurred_at?: string
          payload?: Json
          prev_hash?: string | null
          seq?: number
          transaction_id: string
          user_id?: string
        }
        Update: {
          event_hash?: string
          event_type?: string
          id?: string
          occurred_at?: string
          payload?: Json
          prev_hash?: string | null
          seq?: number
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          accepted_at: string | null
          created_at: string
          evidence_hash: string | null
          execution_id: string
          id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          evidence_hash?: string | null
          execution_id: string
          id?: string
          status?: string
          title: string
          user_id?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          evidence_hash?: string | null
          execution_id?: string
          id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "executions"
            referencedColumns: ["id"]
          },
        ]
      }
      other_documents: {
        Row: {
          content_hash: string
          created_at: string
          extracted_facts: Json
          id: string
          issuer: string | null
          semantic_type: string
          subject: string | null
          transaction_id: string
          user_id: string
          version: number
        }
        Insert: {
          content_hash: string
          created_at?: string
          extracted_facts?: Json
          id?: string
          issuer?: string | null
          semantic_type: string
          subject?: string | null
          transaction_id: string
          user_id?: string
          version?: number
        }
        Update: {
          content_hash?: string
          created_at?: string
          extracted_facts?: Json
          id?: string
          issuer?: string | null
          semantic_type?: string
          subject?: string | null
          transaction_id?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "other_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_sessions: {
        Row: {
          created_at: string
          id: string
          settled_at: string | null
          status: string
          tokens: number
          usd: number
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settled_at?: string | null
          status?: string
          tokens: number
          usd: number
          user_id?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settled_at?: string | null
          status?: string
          tokens?: number
          usd?: number
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_sessions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      pois: {
        Row: {
          canonical_hash: string | null
          created_at: string
          id: string
          intent_id: string
          sealed_at: string | null
          status: string
          token_entry_id: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          canonical_hash?: string | null
          created_at?: string
          id?: string
          intent_id: string
          sealed_at?: string | null
          status?: string
          token_entry_id?: string | null
          transaction_id: string
          user_id?: string
        }
        Update: {
          canonical_hash?: string | null
          created_at?: string
          id?: string
          intent_id?: string
          sealed_at?: string | null
          status?: string
          token_entry_id?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pois_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pois_token_entry_id_fkey"
            columns: ["token_entry_id"]
            isOneToOne: false
            referencedRelation: "token_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pois_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "spine_transactions"
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
      search_runs: {
        Row: {
          candidates: Json
          created_at: string
          id: string
          queries: Json
          transaction_id: string
          user_id: string
        }
        Insert: {
          candidates?: Json
          created_at?: string
          id?: string
          queries?: Json
          transaction_id: string
          user_id?: string
        }
        Update: {
          candidates?: Json
          created_at?: string
          id?: string
          queries?: Json
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "search_runs_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      social_news_items: {
        Row: {
          created_at: string
          excerpt: string | null
          id: string
          observed_at: string | null
          publisher: string | null
          source_url: string | null
          subject_match: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          excerpt?: string | null
          id?: string
          observed_at?: string | null
          publisher?: string | null
          source_url?: string | null
          subject_match?: string | null
          transaction_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          excerpt?: string | null
          id?: string
          observed_at?: string | null
          publisher?: string | null
          source_url?: string | null
          subject_match?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_news_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      spine_api_keys: {
        Row: {
          created_at: string
          id: string
          key: string
          label: string | null
          revoked_at: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          label?: string | null
          revoked_at?: string | null
          user_id?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          label?: string | null
          revoked_at?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spine_api_keys_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spine_transactions: {
        Row: {
          created_at: string
          id: string
          lifecycle: string
          trading_stage: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lifecycle?: string
          trading_stage?: string
          user_id?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lifecycle?: string
          trading_stage?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "spine_transactions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      token_entries: {
        Row: {
          created_at: string
          gate_type: string
          id: string
          idempotency_key: string | null
          tokens: number
          transaction_id: string | null
          usd: number
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          gate_type: string
          id?: string
          idempotency_key?: string | null
          tokens: number
          transaction_id?: string | null
          usd: number
          user_id?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          gate_type?: string
          id?: string
          idempotency_key?: string | null
          tokens?: number
          transaction_id?: string | null
          usd?: number
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wads: {
        Row: {
          created_at: string
          decided_at: string | null
          decision: string | null
          id: string
          poi_id: string
          predicates: Json | null
          status: string
          token_entry_id: string | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          decided_at?: string | null
          decision?: string | null
          id?: string
          poi_id: string
          predicates?: Json | null
          status?: string
          token_entry_id?: string | null
          transaction_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          decided_at?: string | null
          decision?: string | null
          id?: string
          poi_id?: string
          predicates?: Json | null
          status?: string
          token_entry_id?: string | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wads_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wads_token_entry_id_fkey"
            columns: ["token_entry_id"]
            isOneToOne: false
            referencedRelation: "token_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wads_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: true
            referencedRelation: "spine_transactions"
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
      workspaces: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
