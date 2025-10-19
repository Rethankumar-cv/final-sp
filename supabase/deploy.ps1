Write-Host "Installing Supabase CLI locally..."
npx supabase init

Write-Host "Linking to Supabase project..."
$env:SUPABASE_ACCESS_TOKEN = "your_access_token"  # You'll need to replace this
$env:PROJECT_ID = "mudgumcnyawrigwsedsf"

npx supabase link --project-ref $env:PROJECT_ID

Write-Host "Deploying fraud-detection function..."
npx supabase functions deploy fraud-detection --project-ref $env:PROJECT_ID