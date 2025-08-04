from quart import Quart, render_template

app = Quart(__name__)
# Enable template auto-reload and debug for development
app.config.update(TEMPLATES_AUTO_RELOAD=True)
app.debug = True

@app.route("/")
async def index():
    return await render_template("index.html")

if __name__ == "__main__":
    # Running via `python app.py` (local dev without Docker)
    app.run(host="0.0.0.0", port=8000, debug=True)
