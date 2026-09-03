import asianCivilSocietyResearchNetworkLogo from '$lib/assets/images/academic-partners/asian-civil-society-research-network.png';
import universityOfMelbourneLogo from '$lib/assets/images/academic-partners/university-of-melbourne.png';

export interface AcademicPartner {
	name: string;
	logo: string;
	description: string;
	contact: string;
}

export const academicPartners: AcademicPartner[] = [
	{
		name: 'Asian Civil Society Research Network',
		logo: asianCivilSocietyResearchNetworkLogo,
		description:
			'The Asian Civil Society Research Network is an international collaborative academic initiative dedicated to advancing the study of civil society across the Asia-Pacific region. Moving beyond Eurocentric frameworks of liberal individualism, the network re-conceptualizes civil society through the diverse cultural, historical, and political realities of Asian societies. It examines multifaceted dynamics, ranging from democratic solidarity and regionalization to authoritarian and illiberal challenges. Led by Professor Akihiro Ogawa at the University of Melbourne, the network fosters cross-disciplinary collaboration and produces impactful scholarship, including a recognized Routledge book series that captures the varieties and transformations of contemporary Asian civic life.',
		contact: 'akihiro.ogawa@unimelb.edu.au'
	},
	{
		name: 'University of Melbourne Research Cluster on Asian Civil Society',
		logo: universityOfMelbourneLogo,
		description:
			"The Research Cluster on Asian Civil Society at the University of Melbourne’s Asia Institute employs an interdisciplinary approach to examine the dynamically expanding role of civil society across contemporary Asia. Moving beyond Western frameworks, the cluster investigates how distinct cultural values, traditions, and political environments shape state-society relations and influence regional policies. Working closely with the Asian Civil Society Research Network, its scholars explore pressing issues ranging from grassroots activism and transnational networks to authoritarian constraints and human rights advocacy. Through high-impact research, journal special issues, and influential edited volumes, the cluster fosters critical insights into Asia's diverse civic landscapes.",
		contact: 'akihiro.ogawa@unimelb.edu.au'
	}
];
