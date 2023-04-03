import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import TRASH from "../../assets/trash.svg";

import styles from "./RouteList.module.scss";
import { Button, TextField } from "@mui/material";
import { toast } from "react-toastify";

const getItems = (count) =>
	Array.from({ length: count }, (v, k) => k).map((k) => ({
		id: `item-${k}`,
		content: ``,
	}));

const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const getItemStyle = (isDragging) => ({
	background: isDragging ? "lightgreen" : "white",
});

const getListStyle = (isDraggingOver) =>
	!isDraggingOver
		? {
				background: "white",
		  }
		: {};

export default function RouteList({ list, onChange }) {
	const [items, setItems] = useState(list || getItems(2));
	const ref = useRef();

	useEffect(() => {
		onChange(items);
	}, [items]);

	function onDragEnd(result) {
		if (!result.destination) {
			return;
		}

		const value = reorder(
			items,
			result.source.index,
			result.destination.index
		);

		setItems(value);
	}

	function handleChangeItemValue(index, value) {
		const listItem = [...items];
		listItem[index].content = value;
		setItems(listItem);
	}

	function handleDeleteItem(index) {
		if (items.length <= 2) {
			toast.warn("Number of route must be greater than or equal 2");
			return;
		}
		const listItem = [...items];
		listItem.splice(index, 1);
		setItems(listItem);
	}

	function handleAddItem() {
		setItems([...items, { id: `item-${items.length + 1}`, content: "" }]);
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(droppableProvided, droppableSnapshot) => (
					<div
						ref={droppableProvided.innerRef}
						style={getListStyle(droppableSnapshot.isDraggingOver)}
						className={styles.container}
					>
						<div ref={ref}>
							{items.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={item.id}
									index={index}
								>
									{(draggableProvided, draggableSnapshot) => (
										<div
											className={styles.item}
											ref={draggableProvided.innerRef}
											{...draggableProvided.draggableProps}
											{...draggableProvided.dragHandleProps}
											style={{
												...draggableProvided.draggableProps.style,
												...(draggableSnapshot.isDragging
													? { position: "absolute" }
													: {}),
												top:
													draggableProvided.draggableProps.style
														.top -
														ref.current?.getBoundingClientRect?.()
															.y || 0,
											}}
										>
											<div className={styles.control}></div>
											<div
												className={styles.content}
												style={getItemStyle(
													draggableSnapshot.isDragging
												)}
											>
												<TextField
													fullWidth
													value={item.content}
													onChange={(e) =>
														handleChangeItemValue(
															index,
															e.target.value
														)
													}
													variant="outlined"
													placeholder="Enter location's name here"
												/>
												<div className={styles.delete}>
													<Button
														onClick={() =>
															handleDeleteItem(index)
														}
														variant="outlined"
														fullWidth
														color="error"
													>
														<img src={TRASH} alt="" />
													</Button>
												</div>
											</div>
										</div>
									)}
								</Draggable>
							))}
						</div>
						{droppableProvided.placeholder}
						<div className={styles.add}>
							<Button
								onClick={() => handleAddItem()}
								fullWidth
								variant="outlined"
							>
								<p>Add new location</p>
							</Button>
						</div>
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
