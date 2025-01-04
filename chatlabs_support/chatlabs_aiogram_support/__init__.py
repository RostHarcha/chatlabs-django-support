from importlib.util import find_spec

from ..exceptions import ModuleDependenciesError

if not find_spec('aiogram'):
    raise ModuleDependenciesError(
        current_module='Aiogram',
        required_module='chatlabs-framework[aiogram]',
    )

from aiogram_dialog.widgets.kbd import Start
from aiogram_dialog.widgets.text import Const

from .dialogs import dialog_router, states

main_state = states.Support.MAIN

SupportStartButton = Start(
    text=Const('Поддержка'),
    id='start_support_button',
    state=main_state,
)

__all__ = [
    'StartButton',
    'dialog_router',
    'main_state',
    'states',
]
