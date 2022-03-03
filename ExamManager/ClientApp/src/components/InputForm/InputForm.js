import './input-form.css';

function InputForm(props) {
    let inputItems = [];
    for (let item of props.inputItems) {
        inputItems.push(<input key="unique1" className="normal" type={`${item.type}`} placeholder={`${item.placeholder}`} />);
        inputItems.push(<span key="unique2" className="danger" style={{ fontWeight: "bold" }}></span>);
    }
    return (
        <form class="input-form" method="POST" action="login" autocomplete="off">
            <div class="header">{props.formTitle}</div>
            <div class="body">
                {inputItems}
            </div>
            <div class="footer">
                <input type="submit" name="sumbitButton" value="Войти" onclick="this.form.submit(); this.disabled=true;" />
            </div>
        </form>
    )
}

export default InputForm;