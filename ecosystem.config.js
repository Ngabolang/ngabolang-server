module.exports = {
  apps: [{
    name: "app1",
    script: "./app.js",
    watch: true,
    env: {
      "PORT": 80,
      "NODE_ENV": "production",
      "DATABASE_URL": "postgresql://postgres:wiDMkVMeR3Sm4Snt@db.phwolqrsozgtwvplwium.supabase.co:5432/postgres",
      "SECRET_KEY":"rahasia",
      "GOOGLE_CLIENT_ID":"824478663813-6qgd2lijoo5jo1u8deg1qbv6p9bivah5.apps.googleusercontent.com",
      "GOOGLE_CLIENT_SECRET":"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",
     " MIDTRANS_SERVER_KEY":"SB-Mid-server-1yCPx_IYGQjDepohIcIg20Jy"
    }
  }]
}
