-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.uid() PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspaces are viewable by creator." ON workspaces FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Workspaces are insertable by creator." ON workspaces FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Workspaces are updatable by creator." ON workspaces FOR UPDATE USING (auth.uid() = created_by);

-- Create documents table (hierarchical notes)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_folder BOOLEAN DEFAULT false,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Documents viewable by workspace owner." ON documents FOR SELECT USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));
CREATE POLICY "Documents insertable by workspace owner." ON documents FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));
CREATE POLICY "Documents updatable by workspace owner." ON documents FOR UPDATE USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));
CREATE POLICY "Documents deletable by workspace owner." ON documents FOR DELETE USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));

-- Create nodes table (spatial canvas items)
CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  node_type TEXT NOT NULL, -- 'text' or 'image'
  pos_x NUMERIC NOT NULL,
  pos_y NUMERIC NOT NULL,
  pos_z INTEGER NOT NULL DEFAULT 1,
  width NUMERIC,
  height NUMERIC,
  content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nodes viewable by workspace owner." ON nodes FOR SELECT USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));
CREATE POLICY "Nodes insertable by workspace owner." ON nodes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));
CREATE POLICY "Nodes updatable by workspace owner." ON nodes FOR UPDATE USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));
CREATE POLICY "Nodes deletable by workspace owner." ON nodes FOR DELETE USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.created_by = auth.uid()));

-- Setup storage for workspace_media
INSERT INTO storage.buckets (id, name, public) VALUES ('workspace_media', 'workspace_media', true);
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'workspace_media');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'workspace_media' AND auth.role() = 'authenticated');
