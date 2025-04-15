//  LoadingView.swift
//  Template


import Foundation
import UIKit

class LoadingView : UIView {
    
    @IBOutlet weak var logo: UIImageView!
    @IBOutlet weak var progress: UIActivityIndicatorView!
    
    override required init(frame: CGRect) {
        super.init(frame: frame)
        self.loadFromNib(frame: frame)
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    func loadFromNib(frame: CGRect) {
        let identifier = String(describing: LoadingView.self)
        if let loading = Bundle.main.loadNibNamed(identifier, owner: self, options: nil)?.first as? UIView {
            loading.frame = frame
            addSubview(loading)
            if #available(iOS 13.0, *) {
                self.progress.style = .large
            } else {
                self.progress.style = .whiteLarge
            }
            self.progress.startAnimating()
        }
    }

    deinit {
        print("\(LoadingView.self) deinit")
    }
}
