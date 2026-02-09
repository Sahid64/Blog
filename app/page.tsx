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
					Blog
				</p>
				<h2 className='mt-8 text-xl font-medium tracking-tight'>
					
				</h2>
				
			</div>
		</section>
	);
}
