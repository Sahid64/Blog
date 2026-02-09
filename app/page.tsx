import Image from 'next/image';
import { socialLinks } from './config';

export default function Page() {
	return (
		<section>
			<a href={socialLinks.github} target='_blank'>
				<Image
					src='logo_3.jfif'
					alt='Profile photo'
					className='block mx-auto mt-0 mb-10 bg-gray-100 rounded-full lg:mt-5 lg:mb-5 sm:float-right sm:ml-5 sm:mb-5 grayscale hover:grayscale-0'
					unoptimized
					width={160}
					height={160}
					priority
				/>
			</a>
			<h1 className='mb-8 text-2xl font-medium tracking-tight'>
			</h1>
			<div className='prose prose-neutral dark:prose-invert'>
				<p>
					Software Developer passionate about crafting impactful solutions. With
					a strong focus on continuous learning and professional growth.
				</p>
				<h2 className='mt-8 text-xl font-medium tracking-tight'>
					Professional Experience
				</h2>
				{/* TLDG INTEGRADORA */}
				<p>
					<strong>TLDG INTEGRADORA</strong>
					<br />
					Logistics and software development.
					<br />
					July 2025 – Present
				</p>
				{/* INSIDEBYTE */}
				<p>
					<strong>InsideByte</strong>
					<br />
					Software development.
					<br />
					April 2025 – December 2025
				</p>
				{/* IT-ARKON */}
				<p>
					<strong>IT Arkon</strong>
					<br />
					Web developer
					<br />
					July 2023 – July 2025
				</p>
				<ul>
					<li>
						Designed and developed new framework modules, contributing to the
						system’s scalability and performance.
					</li>
					<li>
						Resolved complex bugs and optimized existing features to enhance
						system stability and efficiency.
					</li>
					<li>
						Implemented best practices with Husky to enforce commit standards
						and improve branch management.
					</li>
					<li>
						Utilized technologies such as React, Node.js, Tailwind, PostgreSQL,
						Git, GitHub, and Trello to deliver high-quality solutions.
					</li>
					<li>
						Worked collaboratively in an agile team environment, improving
						communication and problem-solving skills.
					</li>
				</ul>
				<h2 className='mt-8 text-xl font-medium tracking-tight'>Languages</h2>
				<p>
					Spanish: Native
					<br />
					English: B2
				</p>
				<h2 className='mt-8 text-xl font-medium tracking-tight'>
					Additional Skills
				</h2>
				<ul>
					<li>Project management</li>
					<li>Team collaboration</li>
					<li>Adaptability</li>
					<li>Problem-Solving</li>
				</ul>
			</div>
		</section>
	);
}
