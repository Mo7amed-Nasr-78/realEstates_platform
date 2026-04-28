import React, { useState } from "react";

const ComingSoonDialog = () => {
	const [isOpen, setIsOpen] = useState(true);

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay */}
			<div className="fixed inset-0 bg-(--bg-color)/50 z-50 backdrop-blur-sm"></div>

			{/* Dialog Container */}
			<div className="fixed inset-0 flex items-center justify-center z-50 p-4">
				<div className="bg-[#384054] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#51c206] border-opacity-30">
					{/* Header with Gradient */}
					<div className="relative bg-gradient-to-r from-[#51c206] to-[#3da800] px-8 py-12 text-center">
						<div className="absolute inset-0 opacity-10 bg-pattern"></div>
						<h1 className="text-4xl font-Playfair font-bold text-[#181b1b] relative z-10">
							Coming Soon
						</h1>
						<p className="text-[#252422] mt-2 font-Plus-Jakarta-Sans text-sm relative z-10">
							Something Amazing is Being Built
						</p>
					</div>

					{/* Content */}
					<div className="px-8 py-10 space-y-6">
						{/* Feature Preview */}
						<div className="space-y-4">
							<h2 className="text-xl font-Playfair font-semibold text-[#fcfeff]">
								Platform Updates
							</h2>
							<ul className="space-y-3 text-[#b9bbbd] text-sm font-Plus-Jakarta-Sans">
								<li className="flex items-start gap-3">
									<span className="text-[#51c206] font-bold mt-1">
										✓
									</span>
									<span>
										Enhanced property
										listings with
										advanced filters
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-[#51c206] font-bold mt-1">
										✓
									</span>
									<span>
										Improved messaging
										and real-time
										notifications
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-[#51c206] font-bold mt-1">
										✓
									</span>
									<span>
										Advanced booking
										management system
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-[#51c206] font-bold mt-1">
										✓
									</span>
									<span>
										Performance
										optimizations and
										more features
									</span>
								</li>
							</ul>
						</div>

						{/* Divider */}
						<div className="h-px bg-gradient-to-r from-transparent via-[#51c206] to-transparent opacity-30"></div>

						{/* Call to Action */}
						<div className="text-center space-y-2">
							<p className="text-[#b9bbbd] text-sm font-Plus-Jakarta-Sans">
								Currently in active development
							</p>
							<p className="text-[#fcfeff] text-xs font-Plus-Jakarta-Sans opacity-70">
								Check back soon for major
								updates
							</p>
						</div>
					</div>

					{/* Footer / Close Button */}
					<div className="px-8 py-6 bg-opacity-50 flex gap-3">
						<button
							onClick={() => setIsOpen(false)}
							className="flex-1 py-3 px-4 rounded-xl font-Playfair font-semibold text-lg transition duration-300 ease-in-out bg-[#51c206] text-[#252422] hover:bg-[#3da800] hover:scale-95"
						>
							Let's Explore
						</button>
						<button
							onClick={() => setIsOpen(false)}
							className="px-4 py-3 rounded-xl font-Playfair font-semibold text-lg text-[#51c206] border-2 border-[#51c206] transition duration-300 ease-in-out hover:bg-[#51c206] hover:text-[#252422]"
						>
							✕
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default ComingSoonDialog;
