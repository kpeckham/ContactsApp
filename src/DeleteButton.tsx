

type DeleteButtonProps = {
    onClick: () => void;
}

export const DeleteButton = (props: DeleteButtonProps) => {
    return (
    <div className="Button-container Delete-button-container">
    <div>
        <button className="Circle-button Email-delete-button" type="button" onClick={props.onClick}>
            <div>—</div>
        </button>                                     
    </div>
</div>
    );
}