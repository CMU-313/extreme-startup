import json
from flaskr.player import Player
from flaskr.event import Event


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Player):
            return dict(
                id=obj.uuid,
                game_id=obj.game_id,
                name=obj.name,
                score=obj.score,
                api=obj.api,
                events=obj.events,
            )
        elif isinstance(obj, Event):
            return dict(
                id=obj.event_id,
                player_id=obj.player_id,
                query=obj.query,
                difficulty=obj.difficulty,
                points_gained=obj.points_gained,
                response_type=obj.response_type,
                timestamp=obj.timestamp,
            )
        return super().default(obj)
