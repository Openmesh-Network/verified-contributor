PROJECT_ROOT = ..
SMARTCONTRACT_FOLDER = src

# For Python projects
# On Windows, venv scripts/shims are under `Scripts` instead of `bin`.
VENV_FOLDER := bin
ifeq ($(OS),Windows_NT)
	VENV_FOLDER := Scripts
endif

all:
	${MAKE} slither || true
	${MAKE} mythril || true
.PHONY: all

# Slither
VENV_SLITHER = slither
$(VENV_SLITHER)/pyvenv.cfg:
	# Create our Python 3 virtual environment
	python3 -m venv ${VENV_SLITHER}
	$(VENV_SLITHER)/${VENV_FOLDER}/python -m pip install --upgrade pip
	$(VENV_SLITHER)/${VENV_FOLDER}/python -m pip install slither-analyzer

slither: $(VENV_SLITHER)/pyvenv.cfg
	. ./${VENV_SLITHER}/${VENV_FOLDER}/activate && slither ${PROJECT_ROOT}
.PHONY: slither

# Mythril
VENV_MYTHRIL = mythril
$(VENV_MYTHRIL)/pyvenv.cfg:
	# Create our Python 3 virtual environment
	python3 -m venv ${VENV_MYTHRIL}
	$(VENV_MYTHRIL)/${VENV_FOLDER}/python -m pip install --upgrade pip
	$(VENV_MYTHRIL)/${VENV_FOLDER}/python -m pip install mythril

mythril: $(VENV_MYTHRIL)/pyvenv.cfg
	. ./${VENV_MYTHRIL}/${VENV_FOLDER}/activate && find ${PROJECT_ROOT}/${SMARTCONTRACT_FOLDER} -type f -exec myth analyze {} \;
.PHONY: mythril
