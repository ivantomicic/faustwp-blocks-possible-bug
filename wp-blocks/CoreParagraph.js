import { gql } from "@apollo/client";

export default function CoreParagraph(props) {
	const attributes = props?.attributes;

	console.log(props);

	return (
		<div>
			<p
				className={attributes?.cssClassName}
				dangerouslySetInnerHTML={{ __html: attributes?.content }}
			></p>
			<button onClick={() => alert("👻")}>
				This button should return alert
			</button>
		</div>
	);
}

CoreParagraph.fragments = {
	entry: gql`
		fragment CoreParagraphFragment on CoreParagraph {
			attributes {
				content
				fontSize
				textColor
				backgroundColor
				cssClassName
				style
			}
		}
	`,
	key: `CoreParagraphFragment`,
};
