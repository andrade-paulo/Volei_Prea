import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("progress", "routes/progress/layout.tsx", [
    index("routes/progress/index.tsx"),
    route("new", "routes/progress/new.tsx"),
    route("new/random", "routes/progress/new.random.tsx"),
    route("new/balanced", "routes/progress/new.balanced.tsx"),
    route("new/manual", "routes/progress/new.manual.tsx"),
    route("new/add-player", "routes/progress/new.add-player.tsx"),
    route("match", "routes/progress/match.tsx"),
    route("match/end", "routes/progress/match.end.tsx"),
    route("history", "routes/progress/history.tsx"),
    route("history/players", "routes/progress/history.players.tsx"),
  ]),
] satisfies RouteConfig;
