import { gql } from "@apollo/client";
import * as MENUS from "../constants/menus";
import { BlogInfoFragment } from "../fragments/GeneralSettings";
import {
	Header,
	Footer,
	Main,
	Container,
	ContentWrapper,
	EntryHeader,
	NavigationMenu,
	FeaturedImage,
	SEO,
} from "../components";
import { WordPressBlocksViewer } from "@faustwp/blocks";
import getFragmentDataFromBlocks from "../utils/getFragmentDataFromBlocks";
import blocks from "../wp-blocks";
import CoreParagraph from "../wp-blocks/CoreParagraph";

export default function Component(props) {
	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>;
	}

	const { title: siteTitle, description: siteDescription } =
		props?.data?.generalSettings;
	const primaryMenu = props?.data?.headerMenuItems?.nodes ?? [];
	const footerMenu = props?.data?.footerMenuItems?.nodes ?? [];
	const { title, content, featuredImage } = props?.data?.page ?? {
		title: "",
	};

	const { editorBlocks } = props.data.page;

	console.log(editorBlocks);

	return (
		<>
			<SEO
				title={siteTitle}
				description={siteDescription}
				imageUrl={featuredImage?.node?.sourceUrl}
			/>
			<Header
				title={siteTitle}
				description={siteDescription}
				menuItems={primaryMenu}
			/>
			<Main>
				<>
					<EntryHeader title={title} image={featuredImage?.node} />
					<Container>
						<CoreParagraph />
						<WordPressBlocksViewer blocks={editorBlocks} />
					</Container>
				</>
			</Main>
			<Footer title={siteTitle} menuItems={footerMenu} />
		</>
	);
}

Component.variables = ({ databaseId }, ctx) => {
	return {
		databaseId,
		headerLocation: MENUS.PRIMARY_LOCATION,
		footerLocation: MENUS.FOOTER_LOCATION,
		asPreview: ctx?.asPreview,
	};
};

Component.query = gql`
	${BlogInfoFragment}
	${NavigationMenu.fragments.entry}
	${FeaturedImage.fragments.entry}

  # Get all block fragments and add them to the query
  ${getFragmentDataFromBlocks(blocks).entries}

	query GetPageData(
		$databaseId: ID!
		$headerLocation: MenuLocationEnum
		$footerLocation: MenuLocationEnum
		$asPreview: Boolean = false
	) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
      editorBlocks {
        cssClassNames
        isDynamic
        name
        id: clientId
        parentId: parentClientId
        renderedHtml

        # Get all block fragment keys and call them in the query
        ${getFragmentDataFromBlocks(blocks).keys}
      }
			...FeaturedImageFragment
		}
		generalSettings {
			...BlogInfoFragment
		}
		footerMenuItems: menuItems(where: { location: $footerLocation }) {
			nodes {
				...NavigationMenuItemFragment
			}
		}
		headerMenuItems: menuItems(where: { location: $headerLocation }) {
			nodes {
				...NavigationMenuItemFragment
			}
		}
	}
`;
