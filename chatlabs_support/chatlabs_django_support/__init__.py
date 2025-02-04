from importlib.util import find_spec

from ..exceptions import ModuleDependenciesError

if not find_spec('django'):
    raise ModuleDependenciesError(
        current_module='chatlabs_django_support',
        required_module='chatlabs-support[chatlabs_django_support]',
    )


def get_asgi_application():
    import django.core.asgi
    from channels.auth import AuthMiddlewareStack
    from channels.routing import ProtocolTypeRouter, URLRouter

    from .routing import ws_urlpatterns

    return ProtocolTypeRouter({
        'http': django.core.asgi.get_asgi_application(),
        'websocket': AuthMiddlewareStack(URLRouter(ws_urlpatterns)),
    })


__all__ = [
    'get_asgi_application',
]
