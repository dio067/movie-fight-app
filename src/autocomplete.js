const createAutoComplete = ({
  root,
  fetchData,
  renderOption,
  onSelectOption,
  inputValue
}) => {
  root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
      <div class="dropdown-menu">
        <div class="dropdown-content" id="results"></div>
      </div>
    </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('#results');

  const onInput = async (e) => {
    const items = await fetchData(e.target.value);

    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }

    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');

    for (let item of items) {
      const option = document.createElement('a');
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);

      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onSelectOption(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener('input', debounce(onInput, 1000));

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};
