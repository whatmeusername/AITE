import './App.scss';

import AITEditor from './AITEditor/TextEditor';

function App() {
	return (
		<div className="App">
			<img src="data:image/png;base64,PGltZyBzcmM9Imh0dHBzOi8vY21zLmVuam91cm5leS5ydS91cGxvYWQvSmFuYS9GcmFua3JlaWNoL0F0dHJhY3Rpb24vVmlldXgtUG9ydC5qcGciPg" />
			<p className="AITEditor__wrapper__label">developing version of AITEditor: 0.1v</p>
			<div className="AITEditor__wrapper">
				<AITEditor />
			</div>
		</div>
	);
}

export default App;
