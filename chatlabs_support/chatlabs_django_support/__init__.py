from importlib.util import find_spec

from ..exceptions import ModuleDependenciesError

if not find_spec("django"):
    raise ModuleDependenciesError(
        current_module='Django ',
        required_module='chatlabs-framework[django]',
    )
