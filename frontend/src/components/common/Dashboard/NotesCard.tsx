// src/components/common/Dashboard/NotesCard.tsx
const NotesCard = () => {
    return (
        <div className="card p-3 shadow-sm">
            <h6 className="fw-bold mb-2">Quick note</h6>
            <textarea
                className="form-control border-0 bg-light"
                rows={3}
                placeholder="Type a quick note here..."
            ></textarea>
        </div>
    );
};

export default NotesCard;