import { UserRoutes } from "@routes/UserRoute";

const API = "/api";

export default (app) => {
    app.use(API, UserRoutes);

    app.use((req, res) => {
        res.status(400).json({ error: "Unknown URL" });
    });
};
