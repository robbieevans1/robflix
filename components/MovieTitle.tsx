"use client";

import { useEffect, useRef, useState } from "react";

type MovieTitleProps = {
	title: string;
};

export default function MovieTitle({ title }: MovieTitleProps) {
	const containerRef = useRef<HTMLHeadingElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		function checkOverflow() {
			const container = containerRef.current;
			const text = textRef.current;

			if (!container || !text) return;

			setIsOverflowing(text.scrollWidth > container.clientWidth);
		}

		checkOverflow();

		window.addEventListener("resize", checkOverflow);

		return () => {
			window.removeEventListener("resize", checkOverflow);
		};
	}, [title]);

	return (
		<h3
			ref={containerRef}
			className={`movie-card-title text-lg font-bold ${
				isOverflowing ? "movie-card-title-scroll" : ""
			}`}
			title={title}
		>
			<span className="movie-card-title-track">
				<span ref={textRef} className="movie-card-title-copy">
					{title}
				</span>

				{isOverflowing && (
					<span className="movie-card-title-copy" aria-hidden="true">
						{title}
					</span>
				)}
			</span>
		</h3>
	);
}