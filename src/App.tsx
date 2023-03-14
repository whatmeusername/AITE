import {ReactAiteEditor} from "./AITEditor/TextEditor";
import "./App.scss";

function App() {
	return (
		<div className="App">
			<p className="AITEditor__wrapper__label">developing version of AITEditor: 0.1v</p>
			<div className="AITEditor__wrapper">
				<ReactAiteEditor />
			</div>
		</div>
	);
}

export default App;
