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
      ai_dnc_rules: {
        Row: {
          active: boolean
          created_at: string
          created_by: string
          id: string
          reason: string | null
          rule_type: string
          value: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string
          id?: string
          reason?: string | null
          rule_type?: string
          value: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string
          id?: string
          reason?: string | null
          rule_type?: string
          value?: string
        }
        Relationships: []
      }
      ai_suggested_matches: {
        Row: {
          confidence: string
          counterparty_name: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          fit: string
          id: string
          risk: string
          role: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          confidence?: string
          counterparty_name: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          fit?: string
          id?: string
          risk?: string
          role?: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          confidence?: string
          counterparty_name?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          fit?: string
          id?: string
          risk?: string
          role?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggested_matches_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      api_plans: {
        Row: {
          created_at: string
          currency: string
          id: string
          included_allowance: number
          manual_review_fee: number
          monthly_fee: number
          overage_allowed: boolean
          overage_price: number
          plan_name: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          included_allowance?: number
          manual_review_fee?: number
          monthly_fee?: number
          overage_allowed?: boolean
          overage_price?: number
          plan_name: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          included_allowance?: number
          manual_review_fee?: number
          monthly_fee?: number
          overage_allowed?: boolean
          overage_price?: number
          plan_name?: string
        }
        Relationships: []
      }
      api_sandbox_scenarios: {
        Row: {
          active: boolean
          confidence: string | null
          country: string | null
          freshness: string | null
          id: string
          legal_name: string | null
          match_status: string | null
          next_action: string | null
          scenario: string
          scope: string
          verification: string | null
        }
        Insert: {
          active?: boolean
          confidence?: string | null
          country?: string | null
          freshness?: string | null
          id?: string
          legal_name?: string | null
          match_status?: string | null
          next_action?: string | null
          scenario: string
          scope?: string
          verification?: string | null
        }
        Update: {
          active?: boolean
          confidence?: string | null
          country?: string | null
          freshness?: string | null
          id?: string
          legal_name?: string | null
          match_status?: string | null
          next_action?: string | null
          scenario?: string
          scope?: string
          verification?: string | null
        }
        Relationships: []
      }
      api_support_tickets: {
        Row: {
          category: string
          client_ref: string | null
          created_at: string
          environment: string
          id: string
          owner_id: string | null
          severity: string
          status: string
          subject: string
        }
        Insert: {
          category?: string
          client_ref?: string | null
          created_at?: string
          environment?: string
          id?: string
          owner_id?: string | null
          severity?: string
          status?: string
          subject: string
        }
        Update: {
          category?: string
          client_ref?: string | null
          created_at?: string
          environment?: string
          id?: string
          owner_id?: string | null
          severity?: string
          status?: string
          subject?: string
        }
        Relationships: []
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
      bank_verifications: {
        Row: {
          account_last4: string
          country: string | null
          decided_at: string | null
          decided_by: string | null
          id: string
          mode: string
          organisation_id: string | null
          requested_at: string
          status: string
        }
        Insert: {
          account_last4: string
          country?: string | null
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          mode?: string
          organisation_id?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          account_last4?: string
          country?: string | null
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          mode?: string
          organisation_id?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_verifications_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
      compliance_cases: {
        Row: {
          assigned_to: string | null
          case_number: string
          category: string
          created_at: string
          id: string
          resolved_at: string | null
          status: string
          subject: string
          transaction_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          case_number: string
          category?: string
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: string
          subject: string
          transaction_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          case_number?: string
          category?: string
          created_at?: string
          id?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_cases_transaction_id_fkey"
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
      deal_releases: {
        Row: {
          expires_at: string | null
          funder_org_id: string
          id: string
          pack_label: string
          released_at: string
          revoked_at: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          expires_at?: string | null
          funder_org_id: string
          id?: string
          pack_label: string
          released_at?: string
          revoked_at?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          expires_at?: string | null
          funder_org_id?: string
          id?: string
          pack_label?: string
          released_at?: string
          revoked_at?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_releases_funder_org_id_fkey"
            columns: ["funder_org_id"]
            isOneToOne: false
            referencedRelation: "funder_organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_releases_transaction_id_fkey"
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
      disputes: {
        Row: {
          id: string
          raised_at: string
          reason: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          id?: string
          raised_at?: string
          reason: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          id?: string
          raised_at?: string
          reason?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement_notes: {
        Row: {
          author_id: string
          created_at: string
          id: string
          note: string
          poi_id: string
        }
        Insert: {
          author_id?: string
          created_at?: string
          id?: string
          note: string
          poi_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          note?: string
          poi_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_notes_poi_id_fkey"
            columns: ["poi_id"]
            isOneToOne: false
            referencedRelation: "pois"
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
      facilitation_cases: {
        Row: {
          case_number: string
          closed_at: string | null
          counterparty: string | null
          country: string | null
          created_at: string
          currency: string
          due_date: string | null
          final_outcome: string | null
          id: string
          owner_id: string | null
          requester_org: string
          requester_user: string | null
          sector: string | null
          status: string
          transaction_id: string | null
          value: number | null
        }
        Insert: {
          case_number: string
          closed_at?: string | null
          counterparty?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          due_date?: string | null
          final_outcome?: string | null
          id?: string
          owner_id?: string | null
          requester_org: string
          requester_user?: string | null
          sector?: string | null
          status?: string
          transaction_id?: string | null
          value?: number | null
        }
        Update: {
          case_number?: string
          closed_at?: string | null
          counterparty?: string | null
          country?: string | null
          created_at?: string
          currency?: string
          due_date?: string | null
          final_outcome?: string | null
          id?: string
          owner_id?: string | null
          requester_org?: string
          requester_user?: string | null
          sector?: string | null
          status?: string
          transaction_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "facilitation_cases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitation_dnc_rules: {
        Row: {
          created_at: string
          created_by: string
          id: string
          reason: string | null
          rule_type: string
          value: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          reason?: string | null
          rule_type?: string
          value: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          reason?: string | null
          rule_type?: string
          value?: string
        }
        Relationships: []
      }
      facilitation_email_templates: {
        Row: {
          approved_at: string | null
          body: string
          created_at: string
          id: string
          key: string
          name: string
          status: string
          subject: string
          version: number
        }
        Insert: {
          approved_at?: string | null
          body: string
          created_at?: string
          id?: string
          key: string
          name: string
          status?: string
          subject: string
          version?: number
        }
        Update: {
          approved_at?: string | null
          body?: string
          created_at?: string
          id?: string
          key?: string
          name?: string
          status?: string
          subject?: string
          version?: number
        }
        Relationships: []
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
      funder_audit_log: {
        Row: {
          actor_id: string
          created_at: string
          detail: string | null
          event: string
          id: string
        }
        Insert: {
          actor_id?: string
          created_at?: string
          detail?: string | null
          event: string
          id?: string
        }
        Update: {
          actor_id?: string
          created_at?: string
          detail?: string | null
          event?: string
          id?: string
        }
        Relationships: []
      }
      funder_onboarding_requests: {
        Row: {
          contact_email: string
          decided_at: string | null
          decided_by: string | null
          id: string
          org_name: string
          requested_at: string
          status: string
        }
        Insert: {
          contact_email: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          org_name: string
          requested_at?: string
          status?: string
        }
        Update: {
          contact_email?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          org_name?: string
          requested_at?: string
          status?: string
        }
        Relationships: []
      }
      funder_organisations: {
        Row: {
          approved_at: string
          contact_email: string
          id: string
          name: string
          status: string
        }
        Insert: {
          approved_at?: string
          contact_email: string
          id?: string
          name: string
          status?: string
        }
        Update: {
          approved_at?: string
          contact_email?: string
          id?: string
          name?: string
          status?: string
        }
        Relationships: []
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
      go_live_verifications: {
        Row: {
          decided_at: string | null
          decided_by: string | null
          id: string
          legal_entity_id: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          legal_entity_id?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          legal_entity_id?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "go_live_verifications_legal_entity_id_fkey"
            columns: ["legal_entity_id"]
            isOneToOne: false
            referencedRelation: "legal_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_cases: {
        Row: {
          assigned_to: string | null
          case_number: string
          category: string
          created_at: string
          id: string
          status: string
          summary: string
          transaction_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          case_number: string
          category?: string
          created_at?: string
          id?: string
          status?: string
          summary: string
          transaction_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          case_number?: string
          category?: string
          created_at?: string
          id?: string
          status?: string
          summary?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "governance_cases_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      idv_reviews: {
        Row: {
          category: string
          id: string
          reviewed_by: string | null
          status: string
          subject_label: string
          updated_at: string
        }
        Insert: {
          category?: string
          id?: string
          reviewed_by?: string | null
          status?: string
          subject_label: string
          updated_at?: string
        }
        Update: {
          category?: string
          id?: string
          reviewed_by?: string | null
          status?: string
          subject_label?: string
          updated_at?: string
        }
        Relationships: []
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
      kyc_documents: {
        Row: {
          doc_type: string
          id: string
          legal_entity_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          uploaded_at: string
        }
        Insert: {
          doc_type?: string
          id?: string
          legal_entity_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          uploaded_at?: string
        }
        Update: {
          doc_type?: string
          id?: string
          legal_entity_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_documents_legal_entity_id_fkey"
            columns: ["legal_entity_id"]
            isOneToOne: false
            referencedRelation: "legal_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      legacy_repair_flags: {
        Row: {
          flagged_at: string
          id: string
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          transaction_id: string
        }
        Insert: {
          flagged_at?: string
          id?: string
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          transaction_id: string
        }
        Update: {
          flagged_at?: string
          id?: string
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "legacy_repair_flags_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "spine_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_entities: {
        Row: {
          authority_to_bind: boolean
          created_at: string
          entity_type: string
          id: string
          jurisdiction: string | null
          legal_name: string
          organisation_id: string | null
          reg_no: string | null
          screening_status: string
          status: string
          ubo_verified: boolean
        }
        Insert: {
          authority_to_bind?: boolean
          created_at?: string
          entity_type?: string
          id?: string
          jurisdiction?: string | null
          legal_name: string
          organisation_id?: string | null
          reg_no?: string | null
          screening_status?: string
          status?: string
          ubo_verified?: boolean
        }
        Update: {
          authority_to_bind?: boolean
          created_at?: string
          entity_type?: string
          id?: string
          jurisdiction?: string | null
          legal_name?: string
          organisation_id?: string | null
          reg_no?: string | null
          screening_status?: string
          status?: string
          ubo_verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "legal_entities_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_holds: {
        Row: {
          applied_at: string
          applied_by: string
          id: string
          reason: string
          released_at: string | null
          released_by: string | null
          scope_id: string
          scope_type: string
          status: string
        }
        Insert: {
          applied_at?: string
          applied_by?: string
          id?: string
          reason: string
          released_at?: string | null
          released_by?: string | null
          scope_id: string
          scope_type?: string
          status?: string
        }
        Update: {
          applied_at?: string
          applied_by?: string
          id?: string
          reason?: string
          released_at?: string | null
          released_by?: string | null
          scope_id?: string
          scope_type?: string
          status?: string
        }
        Relationships: []
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
      notification_preferences: {
        Row: {
          channels_disabled: boolean
          id: string
          status: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          channels_disabled?: boolean
          id?: string
          status?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          channels_disabled?: boolean
          id?: string
          status?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      org_api_clients: {
        Row: {
          country: string | null
          created_at: string
          id: string
          legal_entity_id: string | null
          production_enabled: boolean
          sandbox_enabled: boolean
          status: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          legal_entity_id?: string | null
          production_enabled?: boolean
          sandbox_enabled?: boolean
          status?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          legal_entity_id?: string | null
          production_enabled?: boolean
          sandbox_enabled?: boolean
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_api_clients_legal_entity_id_fkey"
            columns: ["legal_entity_id"]
            isOneToOne: false
            referencedRelation: "legal_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      organisation_members: {
        Row: {
          created_at: string
          id: string
          organisation_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organisation_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organisation_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          clip_on_plan: string
          country: string | null
          created_at: string
          has_claim: boolean
          id: string
          is_public: boolean
          name: string
          readiness: string
          reg_no: string | null
          sandbox_enabled: boolean
          status: string
        }
        Insert: {
          clip_on_plan?: string
          country?: string | null
          created_at?: string
          has_claim?: boolean
          id?: string
          is_public?: boolean
          name: string
          readiness?: string
          reg_no?: string | null
          sandbox_enabled?: boolean
          status?: string
        }
        Update: {
          clip_on_plan?: string
          country?: string | null
          created_at?: string
          has_claim?: boolean
          id?: string
          is_public?: boolean
          name?: string
          readiness?: string
          reg_no?: string | null
          sandbox_enabled?: boolean
          status?: string
        }
        Relationships: []
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
      platform_settings: {
        Row: {
          id: boolean
          system_status_message: string
          updated_at: string
          updated_by: string | null
          workspace_name: string
        }
        Insert: {
          id?: boolean
          system_status_message?: string
          updated_at?: string
          updated_by?: string | null
          workspace_name?: string
        }
        Update: {
          id?: boolean
          system_status_message?: string
          updated_at?: string
          updated_by?: string | null
          workspace_name?: string
        }
        Relationships: []
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
      rating_appeals: {
        Row: {
          decided_at: string | null
          decided_by: string | null
          id: string
          organisation_id: string | null
          reason: string
          status: string
          submitted_at: string
        }
        Insert: {
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          organisation_id?: string | null
          reason: string
          status?: string
          submitted_at?: string
        }
        Update: {
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          organisation_id?: string | null
          reason?: string
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rating_appeals_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      registry_api_clients: {
        Row: {
          client_name: string
          country: string | null
          created_at: string
          id: string
          lifecycle_status: string
          mode: string
        }
        Insert: {
          client_name: string
          country?: string | null
          created_at?: string
          id?: string
          lifecycle_status?: string
          mode?: string
        }
        Update: {
          client_name?: string
          country?: string | null
          created_at?: string
          id?: string
          lifecycle_status?: string
          mode?: string
        }
        Relationships: []
      }
      registry_api_usage_events: {
        Row: {
          blocked: boolean
          client_id: string | null
          endpoint: string
          id: string
          occurred_at: string
          rate_limited: boolean
          status_code: number
        }
        Insert: {
          blocked?: boolean
          client_id?: string | null
          endpoint: string
          id?: string
          occurred_at?: string
          rate_limited?: boolean
          status_code?: number
        }
        Update: {
          blocked?: boolean
          client_id?: string | null
          endpoint?: string
          id?: string
          occurred_at?: string
          rate_limited?: boolean
          status_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "registry_api_usage_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "registry_api_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      registry_claims: {
        Row: {
          claimant_email: string
          decided_at: string | null
          decided_by: string | null
          id: string
          organisation_id: string
          status: string
          submitted_at: string
        }
        Insert: {
          claimant_email: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          organisation_id: string
          status?: string
          submitted_at?: string
        }
        Update: {
          claimant_email?: string
          decided_at?: string | null
          decided_by?: string | null
          id?: string
          organisation_id?: string
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registry_claims_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
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
      tenant_boundary_runs: {
        Row: {
          id: string
          manifest_sha256: string | null
          run_at: string
          run_by: string | null
          status: string
          tables_checked: number
          tables_fail: number
          tables_pass: number
        }
        Insert: {
          id?: string
          manifest_sha256?: string | null
          run_at?: string
          run_by?: string | null
          status?: string
          tables_checked: number
          tables_fail: number
          tables_pass: number
        }
        Update: {
          id?: string
          manifest_sha256?: string | null
          run_at?: string
          run_by?: string | null
          status?: string
          tables_checked?: number
          tables_fail?: number
          tables_pass?: number
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
      admin_tenant_boundary_probe: {
        Args: never
        Returns: {
          tables_checked: number
          tables_fail: number
          tables_pass: number
        }[]
      }
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
